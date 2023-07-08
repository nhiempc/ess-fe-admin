import React from "react";
import { Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";

function ExcelCurriculumn(props) {
    const { t, i18n } = useTranslation();

    return (
        <Grid className="inforCurriculumn" container lg={12} md={12}>
            <Grid container lg={12} md={12}>
                <Grid lg={10} md={10}>
                    <Grid container item lg={12} alignItems="center" md={12}>
                        <Grid item lg={1} md={1}><img src="../../assets/images/logo.jpg"></img></Grid>
                        <Grid item lg={11} md={11} className="table-cv__intro">
                            <p style={{ fontSize: '18px', fontWeight: '700' }}>East Star Shipping Cp., Ltd.</p>
                            <p>No. 29, Road 4, WaterFront City, Vinh Niem Ward, Le Chan District, Hai Phong City, Vietnam</p>
                            <p>Tel: +84.225.3734698; Fax: +84.225.8832705; Email: hrd@eastar-shipping.com; Web: www.eastar-shipping.com</p>
                        </Grid>
                    </Grid>
                    <Grid lg={12} md={12} style={{ textAlign: 'center', padding: '32px 0' }}><h2>Seamen Employment Application Form</h2></Grid>
                    <Grid lg={12} md={12} container className="table-cv__component">
                        <Grid lg={3} md={3}>
                            <Grid className="table-cv__rowFirst">{t("CV.rankAppliedFor")}</Grid>
                            <Grid>Chủ tàu</Grid>
                        </Grid>
                        <Grid lg={3} md={3} className="table-cv__columnNotFirst">
                            <Grid className="table-cv__rowFirst">{t("CV.recommendedBy")}</Grid>
                            <Grid>ESS</Grid>
                        </Grid>
                        <Grid lg={3} md={3} className="table-cv__columnNotFirst">
                            <Grid className="table-cv__rowFirst">{t("CV.relationshipTo")}</Grid>
                            <Grid> MANNING AGENT</Grid>
                        </Grid>
                        <Grid lg={3} md={3} className="table-cv__columnNotFirst">
                            <Grid className="table-cv__rowFirst">{t("CV.dateOfApplication")}</Grid>
                            <Grid>06/Jul/2023</Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid lg={2} md={2} style={{ border: '1px solid black' }}></Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid lg={4} md={4}>
                    <Grid className="table-cv__rowFirst">{t("CV.name")}</Grid>
                    <Grid>Nguyễn Thanh Vũ</Grid>
                </Grid>
                <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.nationality")}</Grid>
                    <Grid>Việt Nam</Grid>
                </Grid>
                <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.height")}</Grid>
                    <Grid>178</Grid>
                </Grid>
                <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.weight")}</Grid>
                    <Grid>63</Grid>
                </Grid>
                <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.bodyMassIndex")}</Grid>
                    <Grid>103.8</Grid>
                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid container lg={4} md={4}>
                    <Grid lg={4} md={4}>
                        <Grid className="table-cv__rowFirst">{t("CV.dateOfBirth")}</Grid>
                        <Grid>16/09/4043</Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid className="table-cv__rowFirst">{t("CV.placeOfBirth")}</Grid>
                        <Grid>Định Hải, Yên Định, Thanh Hóa</Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid className="table-cv__rowFirst">{t("CV.bloodGroup")}</Grid>
                        <Grid>A B C D O</Grid>
                    </Grid>
                </Grid>
                <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.overallSize")}</Grid>
                    <Grid>Unknown</Grid>
                </Grid>
                <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.safetyShoeSize")}</Grid>
                    <Grid>Nothing</Grid>
                </Grid>
                <Grid lg={1} md={1} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.sex")}</Grid>
                    <Grid>Nam</Grid>
                </Grid>
                <Grid lg={1} md={1} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.religion")}</Grid>
                    <Grid>Việt Nam</Grid>
                </Grid>
                <Grid lg={1} md={1} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.noOfDepende")}</Grid>
                    <Grid>0</Grid>
                </Grid>
                <Grid lg={1} md={1} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.maritalStatus")}</Grid>
                    <Grid>MARRIED</Grid>
                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid lg={4} md={4}>
                    <Grid className="table-cv__rowFirst">{t("CV.applicantPermanenAddress")}</Grid>
                    <Grid>1 2 4 4</Grid>
                </Grid>
                <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.relationship")}</Grid>
                    <Grid>Bố mẹ mình tình bạn</Grid>
                </Grid>
                <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                    <Grid className="table-cv__rowFirst">{t("CV.alternativeRelationship")}</Grid>
                    <Grid>Chỉ có mẹ mày, vợ mày, con mày và tao thế thôi</Grid>
                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid container lg={4} md={4}>
                    <Grid lg={6} md={6} style={{ fontWeight: '700' }}>{t("CV.contactNumbers")}</Grid>
                    <Grid lg={6} md={6}>0987645421</Grid>
                </Grid>
                <Grid lg={4} md={4} className="table-cv__columnNotFirst">

                </Grid>
                <Grid lg={4} md={4} className="table-cv__columnNotFirst">

                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid lg={4} md={4}>
                    <Grid className="table-cv__rowFirst">{t("CV.email")}</Grid>
                    <Grid className="table-cv__rowFirst">thanhvu1692001@gmail.com</Grid>
                    <Grid className="table-cv__rowFirst">{t("CV.skype")}</Grid>
                    <Grid>Live: </Grid>
                </Grid>
                <Grid container lg={8} md={8} className="table-cv__columnNotFirst">
                    <Grid lg={12} md={12} className="table-cv__rowFirst">{t("CV.vaccineStatus")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={12} md={12} className="table-cv__rowFirst">{t("CV.firstDose")}</Grid>
                        <Grid container lg={12} md={12}>
                            <Grid lg={6} md={6} className="table-cv__rowFirst">{t("CV.typeVaccine")}</Grid>
                            <Grid lg={6} md={6} className="table-cv__rowFirst table-cv__columnNotFirst">{t("CV.dateVaccine")}</Grid>
                        </Grid>
                        <Grid container lg={12} md={12}>
                            <Grid lg={6} md={6}>One</Grid>
                            <Grid lg={6} md={6} className="table-cv__columnNotFirst">16/09/2023</Grid>
                        </Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={12} md={12} className="table-cv__rowFirst table-cv__columnNotFirst">{t("CV.firstDose")}</Grid>
                        <Grid container lg={12} md={12} className="table-cv__columnNotFirst">
                            <Grid lg={6} md={6} className="table-cv__rowFirst">{t("CV.typeVaccine")}</Grid>
                            <Grid className="table-cv__rowFirst table-cv__columnNotFirst" lg={6} md={6}>{t("CV.dateVaccine")}</Grid>
                        </Grid>
                        <Grid container lg={12} md={12}>
                            <Grid lg={6} md={6}>Two</Grid>
                            <Grid className="table-cv__columnNotFirst" lg={6} md={6}>11/10/2023</Grid>
                        </Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={12} md={12} className="table-cv__rowFirst table-cv__columnNotFirst">{t("CV.firstDose")}</Grid>
                        <Grid container lg={12} md={12} className="table-cv__columnNotFirst">
                            <Grid lg={6} md={6} className="table-cv__rowFirst">{t("CV.typeVaccine")}</Grid>
                            <Grid className="table-cv__rowFirst table-cv__columnNotFirst" lg={6} md={6}>{t("CV.dateVaccine")}</Grid>
                        </Grid>
                        <Grid container lg={12} md={12}>
                            <Grid lg={6} md={6}>Three</Grid>
                            <Grid className="table-cv__columnNotFirst" lg={6} md={6}>18/11/2023</Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid lg={12} md={12} className="table-cv__rowFirst">Education</Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4}>Course Name</Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">Instiution</Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">Duration</Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">Passin Year</Grid>
                </Grid>
                <Grid container lg={12} md={12}>
                    <Grid lg={4} md={4}>JavaScript</Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">Học viên</Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">2 năm</Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">2023</Grid>
                </Grid>
            </Grid>
            < Grid lg={12} md={12} className="table-cv__component">
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4}>{t("CV.document")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">{t("CV.numberDocument")}</Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">{t("CV.documentIssueBy")}</Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">{t("CV.typeVdateOfIssueaccine")}</Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">{t("CV.dateOfExpiry")}</Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.internalPassport")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">038601016130</Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">Công an Thanh Hóa</Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">25/10/2018</Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">25/10/2023</Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.seafarePasssport")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.visa")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.seamanBook")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STCW10AndFlagStateDocuments")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst"> STCW Regular No.</Grid>

                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.officerCertificateOfCompetency")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.ratingCertificateOfCompetency")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">II/5</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.panamaLicenceOrSeamanBook")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.liberianLicenceOrSeamanBook")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.marshallIslandLicenceOrSeamanBook")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.basicTrainingCertificate")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VI/1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={10} className="table-cv__document--title">{t("CV.STWC10.profinSurvivalCraftAndResBoat")}</Grid>
                        <Grid lg={4} md={2} className="table-cv__columnNotFirst">VI/2</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.profInFastRescueBoats")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VI/2-1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.advancedFireFighting")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VI/3</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.medicalFirstAidAndMedicalCare")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VI/4</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.shipSecurityAwareness")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VI/6-1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.shipDesignatedSecurity")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VI/6-2</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.shipSecurityOfficer")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VI/5</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.eCDISGeneric")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">II/1, II/2, II/3</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.bridgeTeamManagement")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VIII/2</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.engineTeamManagement")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">VIII/2</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} className="table-cv__document--title">{t("CV.STWC10.GMDSS")}</Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.Endor(GMDSS)")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">IV/2</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.radarObservtionCertificate")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">II/1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.STWC10.arpaCertificate")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">II/1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.chemicalTankerOperation.basicTraining")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">V/1-1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.chemicalTankerOperation.advTraining")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">V/1-1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.oilTankerOperation.basicTraining")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">V/1-1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.oilTankerOperation.advTraining")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">V/1-1</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.gasTankerOperation.basicTraining")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">V/1-2</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.gasTankerOperation.advTraining")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst">V/1-2</Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid container lg={4} md={4}>
                        <Grid lg={8} md={8} className="table-cv__document--title">{t("CV.yellowFever")}</Grid>
                        <Grid lg={4} md={4} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid container lg={4} md={4}>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst"></Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst">
                    <Grid lg={4} md={4} colSpan={2} className="table-cv__document--title" style={{ alignSelf: 'center' }}>Certificate & / Or Qualifications</Grid>
                    <Grid lg={8} md={8}>
                        <Grid container lg={12} md={12} className="table-cv__rowFirst">
                            <Grid container lg={6} md={6}>
                                <Grid lg={6} md={6} className="table-cv__columnNotFirst">one</Grid>
                                <Grid lg={6} md={6} className="table-cv__columnNotFirst">two</Grid>
                            </Grid>
                            <Grid lg={3} md={3} className="table-cv__columnNotFirst">thrree</Grid>
                            <Grid lg={3} md={3} className="table-cv__columnNotFirst">eight</Grid>
                        </Grid>
                        <Grid container lg={12} md={12}>
                            <Grid container lg={6} md={6}>
                                <Grid lg={6} md={6} className="table-cv__columnNotFirst">four</Grid>
                                <Grid lg={6} md={6} className="table-cv__columnNotFirst">five</Grid>
                            </Grid>
                            <Grid lg={3} md={3} className="table-cv__columnNotFirst">six</Grid>
                            <Grid lg={3} md={3} className="table-cv__columnNotFirst">seven</Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container lg={12} md={12} className="table-cv__rowFirst pl-8">
                    On the last column, checker to please tick to confirm that the documents have been verified with the originals and initial in this row.
                </Grid>
                <Grid container lg={12} md={12} style={{ fontStyle: 'italic', fontWeight: '700' }}>
                    <Grid lg={4} md={4} colSpan={2} style={{ alignSelf: 'center' }}>**  Where not applicable, please delete..</Grid>
                    <Grid lg={4} md={4}></Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst" style={{ color: 'red' }}>Page 1 of 2.  </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst" style={{ color: 'red' }}>Revised 06/Jul/2023</Grid>
                </Grid>
            </Grid>
            <span>&nbsp;</span>
        </Grid>
    )
}

export default ExcelCurriculumn;
