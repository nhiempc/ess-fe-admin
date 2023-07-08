import React, { useEffect, useState } from 'react';
import { getExperienceByIdSailor } from '../SailorService';

function PdfCurriculumn2({ dataSailor }) {

  const sailorInfor = dataSailor.dataSailor;

  const [beforeExperiences, setBeforeExperiences] = useState([]);

  useEffect(() => {
    if (sailorInfor.id) {
      getExperienceByIdSailor(sailorInfor.id).then((data) => {
        if (data.data.data.length > 0) {
          let dataBeforeExperiences = data.data.data.map(item => ({
            ...item,
            startTime: item.startTime.reverse().toString().replaceAll(',', '/'),
            endTime: item.endTime.reverse().toString().replaceAll(',', '/')
          }))
          setBeforeExperiences(dataBeforeExperiences);
        }
      });
    }
  }, [sailorInfor.id]);

  return (
    <div className='inforCurriculumn'>
      <table>
        <tbody>
          <tr>
            <th colSpan={13} className='text-left'>
              <h3>DETAILS OF PERVIOUS SEA SERVICE 详细的海上经历</h3>
            </th>
          </tr>
          <tr>
            <td>Rank</td>
            <td>Name of Vessel</td>
            <td>Flag of Vessel</td>
            <td>Type of Vessel</td>
            <td>Main Engine</td>
            <td>GRT</td>
            <td>HP</td>
            <td colSpan={3}>Period of Service期间</td>
            <td>Reason for sign-off </td>
            <td>Name of Company</td>
            <td>Name of Manning Agent</td>
          </tr>
          <tr>
            <td rowSpan={2}>职务</td>
            <td rowSpan={2}>船名</td>
            <td rowSpan={2}>船国籍</td>
            <td rowSpan={2}>船型</td>
            <td rowSpan={2}>主机型号</td>
            <td rowSpan={2}>吨位</td>
            <td rowSpan={2}>马力</td>
            <td rowSpan={2}>Sign-On</td>
            <td rowSpan={2}>Sign-Off</td>
            <td>Duration</td>
            <td rowSpan={2}>下船原因</td>
            <td rowSpan={2}>船东公司</td>
            <td rowSpan={2}>船员公司</td>
          </tr>
          <tr>
            <td>(mth)</td>
          </tr>
          {beforeExperiences.map((item, index) => (
            <tr>
              <td>{item?.positionTitleLevel?.name}</td>
              <td>{item?.ship?.name}</td>
              <td>{item?.shipFlag}</td>
              <td>{item?.typeOfShip?.name}</td>
              <td>{item?.ship?.ownerShip}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td className='bg-yellow'>0.00 </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className='bg-yellow'>0.00 </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PdfCurriculumn2;
