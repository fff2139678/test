import React, {Component} from "react";
import {XIcon} from 'xcomponents';

// export default ({
//     nextMonth,
//     previousMonth,
//     onPreviousClick,
//     onNextClick,
//     className,
//     localeUtils,
//     onPreYear,
//     onNextYear,
//     date
//   })=>{
//     return [
//         <XIcon key="pre-year" type="angle-double-left" onClick={() => onPreYear()} />,
//         <XIcon key="left" type="angle-left" onClick={() => onPreviousClick()} />,
//         <XIcon key="right" type="angle-right" onClick={() => onNextClick()} />,
//         <XIcon key="next-year" type="angle-double-right" onClick={() => onNextYear()} />
//     ];
// }

export default{
    Navbar : ({
        nextMonth,
        previousMonth,
        onPreviousClick,
        onNextClick,
        className,
        localeUtils,
        onPreYear,
        onNextYear,
        date
      })=>{
        return [
            <XIcon key="pre-year" type="angle-double-left" onClick={() => onPreYear()} />,
            <XIcon key="left" type="angle-left" onClick={() => onPreviousClick()} />,
            <XIcon key="right" type="angle-right" onClick={() => onNextClick()} />,
            <XIcon key="next-year" type="angle-double-right" onClick={() => onNextYear()} />
        ];
    },
    YearMonthForm: ({ date, localeUtils ,onClick}) =>{

        const handleClick = function handleClick(val){
            onClick(val);
        }
      
        return (
            <div className="DayPicker-Caption">
                <div>
                    <span onClick={()=>{
                        handleClick('month');
                    }}>{date.getMonth()+1}月 </span>
                    <span onClick={()=>{
                        handleClick('year');
                    }}> {date.getFullYear()}</span>
                </div>
            </div>
        );
      }
}

