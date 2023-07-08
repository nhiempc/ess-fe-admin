import React from "react";
import { Grid } from "@material-ui/core";

function ExcelCurriculumn2(props) {
    return (
        <Grid className="inforCurriculumn" container lg={12} md={12}>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid container lg={8} md={8}>
                    <Grid lg={8} md={8}>
                        <Grid>Name: &nbsp;Thanh Vũ</Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                        <Grid>Rank: &nbsp;Chủ tàu</Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                        <Grid>Age: &nbsp;22</Grid>
                    </Grid>
                </Grid>
                <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                    <Grid>East Star Shipping Co., Ltd - Seamen Employment Application Form</Grid>
                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component table-cv__rowFirst">
                <Grid container lg={8} md={8}>
                    <Grid lg={8} md={8} container item>
                        <Grid lg={1} md={1}>
                            <Grid>No</Grid>
                        </Grid>
                        <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                            <Grid>Type</Grid>
                        </Grid>
                        <Grid lg={3} md={3} className="table-cv__columnNotFirst">
                            <Grid>Vissel Name</Grid>
                        </Grid>
                        <Grid lg={5} md={5} className="table-cv__columnNotFirst">
                            <Grid>GRT / Engine Type / KW</Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst" container item>
                        <Grid lg={6} md={6}>
                            <Grid>Rank</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">
                            <Grid>From</Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst" container item>
                        <Grid lg={6} md={6}>
                            <Grid>To</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">
                            <Grid>Mos</Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid lg={4} md={4} className="table-cv__columnNotFirst" container item>
                    <Grid lg={4} md={4}>
                        <Grid>Crew Manning Agent</Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid>Principal/Owner</Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid>Sign Off Reason</Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid container lg={8} md={8}>
                    <Grid lg={8} md={8} container item>
                        <Grid lg={1} md={1}>
                            {/* No */}
                            <Grid>1</Grid>
                        </Grid>
                        <Grid lg={2} md={2} className="table-cv__columnNotFirst">
                            {/* Type */}
                            <Grid>2</Grid>
                        </Grid>
                        <Grid lg={3} md={3} className="table-cv__columnNotFirst">
                            {/* Visel Name */}
                            <Grid>eee</Grid>
                        </Grid>
                        <Grid lg={5} md={5} className="table-cv__columnNotFirst">
                            {/* GRT / Engine Type / KW */}
                            <Grid>rrrr</Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst" container item>
                        <Grid lg={6} md={6}>
                            {/* Rank */}
                            <Grid>3</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">
                            {/* From */}
                            <Grid>4</Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={2} md={2} className="table-cv__columnNotFirst" container item>
                        <Grid lg={6} md={6}>
                            {/* To */}
                            <Grid>5</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">
                            {/* Mos */}
                            <Grid>6</Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid lg={4} md={4} className="table-cv__columnNotFirst" container item>
                    <Grid lg={4} md={4}>
                        {/* Crew Manning Agent */}
                        <Grid>7</Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        {/* Principal/Owner */}
                        <Grid>8</Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        {/* Sign Off Reason */}
                        <Grid>9</Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container lg={12} md={12} className="table-cv__component">
                <Grid lg={8} md={8} container>
                    <Grid lg={12} md={12} className="table-cv__rowFirst" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Please answer the following questions</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">Yes / No</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">If yes, please provide details.</Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Have you previous injuries or sickness ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Premature termination of contract ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Have been dismissed or logged for mischief ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>

                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Have been involved in industrial dispute ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Any criminal offence ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Have been refused entry by any country ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Any special diet or religious restrictions ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Any medical restrictions / drugs / allergies ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Any alcohol drinking habits ?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Any past history medical / mental condition?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={12} md={12} className="table-cv__row" container>
                        <Grid lg={6} md={6} container>
                            <Grid lg={10} md={10}>Can we make reference check with ex employers?</Grid>
                            <Grid lg={2} md={2} className="table-cv__columnNotFirst">NO</Grid>
                        </Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                </Grid>
                <Grid lg={4} md={4} className="table-cv__component">
                    <Grid lg={12} md={12}> - </Grid>
                    <Grid lg={12} md={12} rowSpan={11}>
                        I certify that the information given by me herein are true and correct to the best of my knowledge.  Any false information may be subjected to legal actions and voiding of any benefits arising from my employment contracts.
                    </Grid>
                    <Grid lg={12} md={12} container justifyContent="flex-end" className="p-8">
                        <span style={{ fontWeight: 'bold' }}>Signature Of Applicant</span>
                    </Grid>
                </Grid>
            </Grid>
            <Grid lg={12} md={12} className="table-cv__component">
                <Grid lg={12} md={12} className="table-cv__rowFirst">FOR OFFICIAL USE ONLY </Grid>
                <Grid lg={12} md={12} container className="table-cv__rowFirst">
                    <Grid lg={4} md={4} >Interview assesment</Grid>
                    <Grid lg={4} md={4} container>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">Reference check done by / Date</Grid>
                        <Grid lg={6} md={6} className="table-cv__columnNotFirst">Please provide details</Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        Interview report to describe applicant's technical competence & experience
                    </Grid>
                </Grid>


                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>English</Grid>
                        <Grid lg={6} md={6} container>
                            <Grid lg={2} md={2} className="mx-4">Poor</Grid>
                            <Grid lg={2} md={2} className="mx-4">Ave</Grid>
                            <Grid lg={2} md={2} className="mx-4">Good</Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Previous employment /agent PIC ?</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6} className="table-cv__row">Speak/Read</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Verify service record</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Write</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Verify reason for leaving</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Physical</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Verify overall appraisal</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Personality</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Verify relationship / habits</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Intelligence</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}></Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Attitude</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Interviewer's  Name / Date</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Co-Operations</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Suitability</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Motivation</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Type of ships</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Learning ability</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Type of Trade  /  Principal</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>

                <Grid lg={12} md={12} container className="table-cv__row">
                    <Grid lg={4} md={4} container className="">
                        <Grid lg={6} md={6}>Learning ability</Grid>
                        <Grid lg={6} md={6} container >
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                            <Grid lg={2} md={2} className="cv-table__checkbox"></Grid>
                        </Grid>
                    </Grid>
                    <Grid lg={4} md={4} className="table-cv__columnNotFirst">
                        <Grid lg={6} md={6}>Last Drawn Wages</Grid>
                        <Grid className="table-cv__columnNotFirst"></Grid>
                    </Grid>
                    <Grid className="table-cv__columnNotFirst"></Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ExcelCurriculumn2;
