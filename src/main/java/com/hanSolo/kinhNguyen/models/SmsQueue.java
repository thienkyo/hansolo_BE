package com.hanSolo.kinhNguyen.models;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "sms_queue")
public class SmsQueue extends ParentCodeModel{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "gmt_create", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date gmtCreate;

    @Column(name = "gmt_modify", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date gmtModify;

    @Column(name = "receiver_name", length = 80)
    private String receiverName;

    @Column(name = "receiver_phone", length = 30)
    private String receiverPhone;

    @Column(name = "content")
    private String content;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "job_id")
    private Integer jobId;

    @Transient
    private String passCode;

    @Column(name = "weight", length = 2, columnDefinition = "varchar(2) default '1'")
    private String weight;

    @Column(name = "job_type", length = 30)
    private String jobType;

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getPassCode() {
        return passCode;
    }

    public void setPassCode(String passCode) {
        this.passCode = passCode;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public Date getGmtModify() {return gmtModify;}

    public void setGmtModify(Date gmtModify) {
        this.gmtModify = gmtModify;
    }

    public Date getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(Date gmtCreate) {this.gmtCreate = gmtCreate;}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

}