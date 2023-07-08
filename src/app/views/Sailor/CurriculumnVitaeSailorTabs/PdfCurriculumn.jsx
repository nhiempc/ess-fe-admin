import React, { useEffect, useState } from 'react';
import {
  getCompleteTrainingCourseByIdSailor,
  getDocumentCertificateByIdSailor,
  getRelativeByIdSailor
} from '../SailorService';

function PdfCurriculumn({ dataSailor }) {
  useEffect(() => {}, []);
  const sailorInfor = {
    ...dataSailor.dataSailor,
    dateOfBirth: dataSailor.dataSailor.dateOfBirth
      .reverse()
      .toString()
      .replaceAll(',', '/')
  };
  const [familyInfo, setFamilyInfo] = useState([]);
  const [completedCourse, setCompletedCourse] = useState([]);
  const [certificates, setCertificates] = useState([]);

  let relations = {
    1: 'Vợ',
    2: 'Chồng',
    3: 'Con',
    4: 'Bố mẹ',
    5: 'Ông bà',
    6: 'Khác'
  };

  useEffect(() => {
    if (sailorInfor.id) {
      getRelativeByIdSailor(sailorInfor.id).then((data) => {
        if (data.data.data.length > 0) {
          setFamilyInfo(data.data.data);
        }
      });
    }
  }, [sailorInfor.id]);

  useEffect(() => {
    if (sailorInfor.id) {
      getCompleteTrainingCourseByIdSailor(sailorInfor.id).then((data) => {
        if (data.data.data.length > 0) {
          let dataCourse = data.data.data.map((item) => ({
            ...item,
            startDate: item.startDate.reverse().toString().replaceAll(',', '/'),
            endDate: item.endDate.reverse().toString().replaceAll(',', '/')
          }));
          setCompletedCourse(dataCourse);
        }
      });
    }
  }, [sailorInfor.id]);

  useEffect(() => {
    if (sailorInfor.id) {
      getDocumentCertificateByIdSailor(sailorInfor.id).then((data) => {
        if (data.data.data.length > 0) {
          let dataCertificate = data.data.data.map(item => ({
            ...item,
            expirationDate: item.expirationDate.reverse().toString().replaceAll(',', '/')
          }))
          setCertificates(dataCertificate);
        }
      });
    }
  }, [sailorInfor.id]);

  return (
    <div className='inforCurriculumn'>
      <table>
        <tbody>
          <tr>
            <th colSpan={12} className='text-left'>
              <h3>PERSONAL PARTICULARS 个人资料</h3>
            </th>
            <th rowSpan={6}></th>
          </tr>
          <tr>
            <td colSpan={3} className='fw-bold'>
              Position Applied 申请职务
            </td>
            <td colSpan={9} className='fw-bold'>
              Name 姓名
            </td>
          </tr>
          <tr>
            <td colSpan={3}>{sailorInfor?.positionTitleLevel?.name}</td>
            <td colSpan={9}>{sailorInfor?.name}</td>
          </tr>
          <tr>
            <td colSpan={2} className='fw-bold'>
              Skype ID
            </td>
            <td colSpan={3} className='fw-bold'>
              Mobile No. 手机号码
            </td>
            <td colSpan={3} className='fw-bold'>
              Height身高
            </td>
            <td colSpan={2} className='fw-bold'>
              Weight体重
            </td>
            <td colSpan={2} className='fw-bold'>
              Safety Shoes安全鞋
            </td>
          </tr>
          <tr>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={3}>{sailorInfor?.phone}</td>
            <td colSpan={3}>{sailorInfor?.height}cm</td>
            <td colSpan={2}>{sailorInfor?.weight}kg</td>
            <td colSpan={2}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={2} className='fw-bold'>
              Place of Birth 出生地
            </td>
            <td colSpan={3} className='fw-bold'>
              Date of Birth 出生日期
            </td>
            <td colSpan={3} className='fw-bold'>
              Nationality 国籍
            </td>
            <td colSpan={2} className='fw-bold'>
              Overall工作服
            </td>
            <td colSpan={2} className='fw-bold'>
              Blood Type 血型
            </td>
          </tr>
          <tr>
            <td colSpan={2}>{sailorInfor?.placeOfBirth}</td>
            <td colSpan={3}>{sailorInfor?.dateOfBirth}</td>
            <td colSpan={3}>{sailorInfor?.national?.name}</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={3}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={2} className='fw-bold'>
              ID No. 身份证号
            </td>
            <td colSpan={3} className='fw-bold'>
              Marital Status 婚姻状态
            </td>
            <td colSpan={3} className='fw-bold'>
              Religion 宗教
            </td>
            <td colSpan={5} className='fw-bold'>
              Medical History 既往病史
            </td>
          </tr>
          <tr>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={3}>
              {sailorInfor?.maritalOption === 1 ? 'Đã kết hôn' : 'Độc thân'}
            </td>
            <td colSpan={3}>Chưa có thông tin</td>
            <td colSpan={5}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={13} className='fw-bold'>
              Home Address 目前家庭住址
            </td>
          </tr>
          <tr>
            <td colSpan={13}>{sailorInfor?.permanentAddress}</td>
          </tr>
          <tr>
            <th colSpan={13} className='text-left'>
              <h3>HIGHEST ACADEMIC QUALIFICAITION 毕业/培训学校</h3>
            </th>
          </tr>
          <tr>
            <td colSpan={2} className='fw-bold'>
              From 从
            </td>
            <td colSpan={2} className='fw-bold'>
              To 至
            </td>
            <td colSpan={5} className='fw-bold'>
              Institutions/Universities attached 机构/学校名
            </td>
            <td colSpan={4} className='fw-bold'>
              Qualifications 程度
            </td>
          </tr>
          {completedCourse.map((course, index) => (
            <tr key={index}>
              <td colSpan={2}>{course.startDate}</td>
              <td colSpan={2}>{course.endDate}</td>
              <td colSpan={5}>{course?.nameCourse}</td>
              <td colSpan={4}>Chưa có thông tin</td>
            </tr>
          ))}
          <tr>
            <th colSpan={13} className='text-left'>
              <h3>FAMILY BACKGROUND 家庭背景</h3>
            </th>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Next of Kin 直系亲属姓名
            </td>
            <td colSpan={3} className='fw-bold'>
              Relationship 关系
            </td>
            <td colSpan={6} className='fw-bold'>
              Phone No. 家属电话
            </td>
          </tr>
          {familyInfo.map((person, index) => (
            <tr key={index}>
              <td colSpan={4}>{person.name}</td>
              <td colSpan={3}>{relations[person.relationship].toString()}</td>
              <td colSpan={6}>{person.phone}</td>
            </tr>
          ))}
          <tr>
            <th colSpan={4} className='text-left'>
              Qualification Certificate 资格证书
            </th>
            <th colSpan={2}>Cert No. 证书号码</th>
            <th colSpan={2}>Issued Date 发行日</th>
            <th colSpan={2}>Expiry Date 到期日</th>
            <th colSpan={2}>Issued By 发行单位</th>
            <th colSpan={1}>Remark 备注</th>
          </tr>
          {certificates?.map((certificate, index) => (
            <tr>
              <td colSpan={4} className='fw-bold'>
                {certificate?.certificate?.name}
              </td>
              <td colSpan={2}>{certificate?.certificate?.code}</td>
              <td colSpan={2}>Ngày cấp chứng chỉ</td>
              <td colSpan={2}>{certificate?.expirationDate}</td>
              <td colSpan={2}>Được cấp bởi</td>
              <td colSpan={1}>{certificate?.note}</td>
            </tr>
          ))}
          {/* <tr>
            <td colSpan={4} className='fw-bold'>
              Passport <br></br>护照
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Seaman book <br></br>海员证
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Certificate of Competency(COC) <br></br>适任证
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Certificate of Competency(WATCHKEEPING) <br></br>值班证书
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Seafar&#39;s indentity document (CDC) <br></br>服务簿
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Basic training <br></br>基本安全
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Proficiency in survival craft and rescue boat <br></br>
              精通救生艇筏和救助艇培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Proficiency in fast rescue boats <br></br>精通快速救助艇培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Training in advanced fire fighting <br></br>高级消防培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Training in medical first aid <br></br>精通急救培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Training in medical care <br></br>船上医护培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Proficiency for ship security officer <br></br>船舶保安员培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Security awareness training <br></br>保安意识培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Seafarers with designated security duties <br></br>
              负有指定保安职责船员培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Traning for master and chief mates of large ships <br></br>
              大型船舶操纵特殊培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Basic training for liquefied gas tanker cargo operation <br></br>
              液化气船货物操作基本培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Advanced training for Liquefied tanker cargo operation <br></br>
              液化气船货物操作高级培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Basic training for Oil and Chemical tanker cargo operation{' '}
              <br></br>
              油船和化学品船货物操作基本培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Advanced training for Oil Tanker cargo operation <br></br>
              油船货物操作高级培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Advanced training for Chemical Tanker cargo operation <br></br>
              化学品船货物高级培训
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Panama License <br></br>巴拿马证书
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Hongkong License <br></br>香港证书
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Medical Certifciate for seafarers of CHINA MSA <br></br>
              海船船员健康证书
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Medical Book <br></br>卫检体检
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Yellow Fever <br></br>黄热
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              Cholera <br></br>霍乱
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              US VISA <br></br>美国签证
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr>
          <tr>
            <td colSpan={4} className='fw-bold'>
              MCV <br></br>澳洲签证
            </td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={2}>Chưa có thông tin</td>
            <td colSpan={1}>Chưa có thông tin</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
}

export default PdfCurriculumn;
