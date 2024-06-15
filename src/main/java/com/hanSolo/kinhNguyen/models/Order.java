package com.hanSolo.kinhNguyen.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order extends ParentCodeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "coupon_code", length = 40)
    private String couponCode;

    @Column(name = "coupon_discount")
    private Integer couponDiscount;

    @Column(name = "ext_info", length = 800)
    private String extInfo;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "shipping_address", nullable = false, length = 600)
    private String shippingAddress;

    @Column(name = "shipping_name")
    private String shippingName;

    @Column(name = "shipping_phone", length = 20)
    private String shippingPhone;

    @Column(name = "relationship", length = 100)
    private String relationship;

    @Column(name = "location", length = 50)
    private String location;

    @Column(name = "deposit")
    private Integer deposit;

    @Column(name = "shipping_id", length = 50)
    private String shippingId;

    @Column(name = "gmt_create", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date gmtCreate;

    @Column(name = "gmt_modify", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date gmtModify;

    @OneToMany( cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    @NotFound(action = NotFoundAction.IGNORE)
    private List<OrderDetail> orderDetails = new ArrayList<>();

   // @Transient
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    @Fetch(FetchMode.JOIN)
    private Member member;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "cus_source")
    private Integer cusSource;

    private Integer currentCusSource;

    @Column(name = "specific_job_id")
    private Integer specificJobId;

    @Column(name = "specific_job_name")
    private String specificJobName;

    @Column(name = "area_code")
    private String areaCode;

    @Transient
    private String currentCouponCode;

    @Column(name = "last_modified_by", length = 110)
    private String lastModifiedBy;

    @Column(name = "done_sms_payment_notify",columnDefinition = "boolean default false")
    private Boolean doneSmsPaymentNotify;

    @Column(name = "custom_discount_amount", columnDefinition = "integer default 0")
    private Integer customDiscountAmount;

    public Integer getCustomDiscountAmount() {
        return customDiscountAmount;
    }

    public void setCustomDiscountAmount(Integer customDiscountAmount) {
        this.customDiscountAmount = customDiscountAmount;
    }

    public Boolean getDoneSmsPaymentNotify() {
        return doneSmsPaymentNotify;
    }

    public void setDoneSmsPaymentNotify(Boolean doneSmsPaymentNotify) {
        this.doneSmsPaymentNotify = doneSmsPaymentNotify;
    }

    @Override
    public boolean equals(Object obj) {
        Order o = (Order)obj;
        return this.getShippingPhone().equalsIgnoreCase(o.getShippingPhone())
            //    && this.getShippingName().equalsIgnoreCase(o.getShippingName())
                && this.getId().intValue() == o.getId().intValue();
    }

    public Order() {}

    public Order(Integer id, String shippingName, String shippingPhone,String shippingAddress, Date gmtCreate, String location) {
        this.id = id;
        this.shippingAddress = shippingAddress;
        this.shippingName = shippingName;
        this.shippingPhone = shippingPhone;
        this.gmtCreate = gmtCreate;
        this.location = location;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getCurrentCouponCode() {
        return currentCouponCode;
    }

    public void setCurrentCouponCode(String currentCouponCode) {
        this.currentCouponCode = currentCouponCode;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public String getSpecificJobName() {
        return specificJobName;
    }

    public void setSpecificJobName(String specificJobName) {
        this.specificJobName = specificJobName;
    }

    public Integer getSpecificJobId() {
        return specificJobId;
    }

    public void setSpecificJobId(Integer specificJobId) {
        this.specificJobId = specificJobId;
    }

    public Integer getCurrentCusSource() {
        return currentCusSource;
    }

    public void setCurrentCusSource(Integer currentCusSource) {
        this.currentCusSource = currentCusSource;
    }

    public Integer getCusSource() {
        return cusSource;
    }

    public void setCusSource(Integer cusSource) {
        this.cusSource = cusSource;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public Date getGmtModify() {
        return gmtModify;
    }

    public void setGmtModify(Date gmtModify) {
        this.gmtModify = gmtModify;
    }

    public Date getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    public String getShippingId() {
        return shippingId;
    }

    public void setShippingId(String shippingId) {
        this.shippingId = shippingId;
    }

    public Integer getDeposit() {
        return deposit;
    }

    public void setDeposit(Integer deposit) {
        this.deposit = deposit;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getShippingName() {
        return shippingName;
    }

    public void setShippingName(String shippingName) {
        this.shippingName = shippingName;
    }

    public String getShippingPhone() {
        return shippingPhone;
    }

    public void setShippingPhone(String shippingPhone) {
        this.shippingPhone = shippingPhone;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getExtInfo() {
        return extInfo;
    }

    public void setExtInfo(String extInfo) {
        this.extInfo = extInfo;
    }

    public Integer getCouponDiscount() {
        return couponDiscount;
    }

    public void setCouponDiscount(Integer couponDiscount) {
        this.couponDiscount = couponDiscount;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

}