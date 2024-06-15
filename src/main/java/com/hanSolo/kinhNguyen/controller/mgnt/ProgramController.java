package com.hanSolo.kinhNguyen.controller.mgnt;

import com.hanSolo.kinhNguyen.DTO.SmsStringResult;
import com.hanSolo.kinhNguyen.models.Coupon;
import com.hanSolo.kinhNguyen.models.Order;
import com.hanSolo.kinhNguyen.models.ProgramResult;
import com.hanSolo.kinhNguyen.models.SmsJob;
import com.hanSolo.kinhNguyen.models.SmsQueue;
import com.hanSolo.kinhNguyen.repository.CouponRepository;
import com.hanSolo.kinhNguyen.repository.OrderRepository;
import com.hanSolo.kinhNguyen.repository.ProgramResultRepository;
import com.hanSolo.kinhNguyen.repository.SmsJobRepository;
import com.hanSolo.kinhNguyen.repository.SmsQueueRepository;
import com.hanSolo.kinhNguyen.request.LuckyDrawRequest;
import com.hanSolo.kinhNguyen.request.QueryByClientShopAmountRequest;
import com.hanSolo.kinhNguyen.response.GeneralResponse;
import com.hanSolo.kinhNguyen.utility.Utility;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/mgnt/program")
public class ProgramController {

    @Autowired private OrderRepository orderRepo;
    @Autowired private SmsJobRepository smsJobRepo;
    @Autowired private ProgramResultRepository programResultRepo;
    @Autowired private CouponRepository couponRepo;
    @Autowired private SmsQueueRepository smsQueueRepo;

    @RequestMapping("saveResult")
    public GeneralResponse<List<ProgramResult>> saveResult(@RequestBody final LuckyDrawRequest req, final HttpServletRequest request) throws ParseException {

        //List<String> orderIdList = Arrays.asList(req.getOrderIdList().split(","));
        String[] orderIdList = req.getOrderIdList().replace(" ","").split(",");
        List<Integer> orderIdList2 = Arrays.stream(orderIdList)    // stream of String
                .map(Integer::valueOf) // stream of Integer
                .collect(Collectors.toList());
        List<Order> orderList = orderRepo.findByIdInAndClientCode(orderIdList2, req.getClientCode());

        if(orderList.isEmpty()){
            return new GeneralResponse<>(null,Utility.FAIL_ERRORCODE,Utility.FAIL_MSG);
        }

        SmsJob job = smsJobRepo.findById(req.getSmsJobId()).get();

        List<ProgramResult> result = new ArrayList<>();
        for (Order or : orderList) {
            ProgramResult oneResult = new ProgramResult();
            oneResult.setOrderCreateDate(or.getGmtCreate());
            oneResult.setStatus(false);
            oneResult.setExpiry(req.getExpiry());
            oneResult.setWinnerName(or.getShippingName());
            oneResult.setGmtModify(Utility.getCurrentDate());
            oneResult.setGmtCreate(Utility.getCurrentDate());
            oneResult.setWinnerPhone(or.getShippingPhone());
            oneResult.setClientCode(req.getClientCode());
            oneResult.setShopCode(req.getShopCode());
            SmsStringResult smsDynamic = Utility.buildDynamicSms(job);
            oneResult.setSmsContent(smsDynamic.getSmsString());
            oneResult.setCode(smsDynamic.getExtendInfo());
            oneResult.setCouponValue(req.getCouponValue());
            oneResult.setOrderId(or.getId());
            oneResult.setJobName(job.getJobName());
            oneResult.setJobId(job.getId());
            result.add(oneResult);
        }

        return new GeneralResponse<>((List<ProgramResult>) programResultRepo.saveAll(result),Utility.SUCCESS_ERRORCODE,Utility.SUCCESS_MSG);
    }

    @RequestMapping("createCouponAndSms")
    public GeneralResponse<List<ProgramResult>> createCouponAndSms(@RequestBody final LuckyDrawRequest req, final HttpServletRequest request) throws ParseException {

        List<ProgramResult> programResults = programResultRepo.findByClientCodeAndStatus(req.getClientCode(),false);

        if(programResults.isEmpty()){
            return new GeneralResponse("no data to process",Utility.FAIL_ERRORCODE,Utility.FAIL_MSG);
        }

        List<Coupon> couponList = new ArrayList<>();
        List<SmsQueue> smsList = new ArrayList<>();

        for (ProgramResult pro : programResults) {

            if(StringUtils.isNotEmpty(pro.getCode())){
                Coupon coupon = new Coupon();
                coupon.setQuantity(1);
                coupon.setGmtCreate(Utility.getCurrentDate());
                coupon.setGmtModify(Utility.getCurrentDate());
                coupon.setCouponType(Utility.COUPON_TYPE_BILL);
                coupon.setCode(pro.getCode());
                coupon.setCreatedBy(Utility.COUPON_CREATED_BY_TOOL);
                coupon.setLastModifiedBy(Utility.COUPON_CREATED_BY_TOOL);
                coupon.setLifespan(pro.getExpiry());
                coupon.setName(pro.getWinnerName()+" "+pro.getWinnerPhone() +" "+ pro.getJobName());
                coupon.setValue(pro.getCouponValue());
                coupon.setClientCode(req.getClientCode());
                coupon.setShopCode(req.getShopCode());
                couponList.add(coupon);
            }

            SmsQueue sms = new SmsQueue();
            sms.setContent(pro.getSmsContent()+"["+ RandomStringUtils.randomAlphanumeric(4)+"]");
            sms.setWeight("1");
            sms.setGmtCreate(Utility.getCurrentDate());
            sms.setGmtModify(Utility.getCurrentDate());
            sms.setGender(true);
            sms.setReceiverPhone(pro.getWinnerPhone());
            sms.setReceiverName(pro.getWinnerName());
            sms.setStatus(Utility.SMS_QUEUE_INIT);
            sms.setClientCode(req.getClientCode());
            sms.setShopCode(req.getShopCode());
            sms.setJobId(pro.getJobId());
            sms.setJobType(Utility.SMS_JOB_LUCKYDRAW);
            smsList.add(sms);

            // set it done.
            pro.setStatus(true);
        }
        couponRepo.saveAll(couponList);
        smsQueueRepo.saveAll(smsList);
        programResultRepo.saveAll(programResults);


        return new GeneralResponse(programResults,Utility.SUCCESS_ERRORCODE,Utility.SUCCESS_MSG);
    }

    @RequestMapping(value = "getByClientCode", method = RequestMethod.POST)
    public List<ProgramResult> getByClientCode(@RequestBody final QueryByClientShopAmountRequest req, final HttpServletRequest request) {
        return programResultRepo.findByClientCodeOrderByGmtCreateDesc(req.getClientCode());
    }

    @RequestMapping(value = "getByShopCode", method = RequestMethod.POST)
    public List<ProgramResult> getByShopCode(@RequestBody final QueryByClientShopAmountRequest req, final HttpServletRequest request) {
        return programResultRepo.findByClientCodeAndShopCodeOrderByGmtCreateDesc(req.getClientCode(), req.getShopCode());
    }

    @RequestMapping(value = "delete", method = RequestMethod.POST)
    public GeneralResponse<String> delete(@RequestBody final ProgramResult role, final HttpServletRequest request) {
        programResultRepo.delete(role);
        return new GeneralResponse("delete_ProgramResult_success",Utility.SUCCESS_ERRORCODE,"Success");
    }

}
