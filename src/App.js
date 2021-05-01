import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { pingCowin } from "./cowin";
import districtConstants from "./constants/districts";
import { getTomorrowsDate } from "./dateutils";

const ageList = [
  {
    label: "👨 < 45",
    value: 20,
  },
  {
    label: "👨 > 45",
    value: 50,
  },
];

const SelectStateButton = ({ value, label, activeState, setActiveState, setActiveDistrict }) => {
  return (
    <button
      className={
        activeState === value ? "text-blue " : "" + " cursor-pointer "
      }
      onClick={() => {
        setActiveState(value);
        setActiveDistrict(null);
      }}
    >
      {label}
    </button>
  );
};

function App() {
  const [centerInfo, setCenterInfo] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeState, setActiveState] = useState("kerala");
  const [activeAgeCategory, setActiveAgeCategory] = useState(ageList[1]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeDate, setActiveDate] = useState(getTomorrowsDate());

  const searchCenters = async () => {
    if (activeDistrict) {
      setIsLoading(true);
      const data = await pingCowin({
        districtId: activeDistrict?.value,
        ageValue: activeAgeCategory?.value,
        date: activeDate,
      });
      setCenterInfo(data);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen py-10 px-4 md:px-10 flex justify-center items-center bg-gray-700">
      <div className="absolute top-2 flex gap-2">
        <button
          className={
            activeState === "kerala"
              ? "text-white "
              : "" + " cursor-pointer "
          }
          onClick={() => {
            setActiveState("kerala");
            setActiveDistrict(null);
          }}
        >
          Kerala
        </button>
        {/* <SelectStateButton
        value={"kerala"}
        label={"Kerala"}
        activeState={activeState}
        setActiveDate={setActiveState}
        setActiveDistrict={setActiveDistrict}
        /> */}
        <button
          className={
            activeState === "tamilnadu"
              ? "text-white "
              : "" + " cursor-pointer "
          }
          onClick={() => {
            setActiveState("tamilnadu");
            setActiveDistrict(null);
          }}
        >
          TamilNadu
        </button>
        <button
          className={
            activeState === "karnataka"
              ? "text-white "
              : "" + " cursor-pointer "
          }
          onClick={() => {
            setActiveState("karnataka");
            setActiveDistrict(null);
          }}
        >
          Karnataka
        </button>
        <button
          className={
            activeState === "westbengal"
              ? "text-white "
              : "" + " cursor-pointer "
          }
          onClick={() => {
            setActiveState("westbengal");
            setActiveDistrict(null);
          }}
        >
          West Bengal
        </button>
      </div>
      <div className="h-full w-full flex flex-col gap-2 items-center md:w-1/2 p-2 rounded-lg border-2 border-gray-300 bg-gray-100 shadow-inner">
        <div className="flex w-full gap-2">
          <Select
            isLoading={isLoading}
            isClearable={true}
            isSearchable={true}
            placeholder={"Select District"}
            error={false}
            className="w-8/12"
            name="districtList"
            value={activeDistrict}
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary: "#0097e6",
              },
            })}
            options={districtConstants[activeState]}
            onChange={(selected) => setActiveDistrict(selected || null)}
          />
          <Select
            isLoading={false}
            placeholder={"Select Age Category"}
            error={false}
            defaultValue={activeAgeCategory}
            className="w-4/12 text-bold"
            name="ageList"
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary: "#0097e6",
              },
            })}
            options={ageList}
            onChange={(selected) => setActiveAgeCategory(selected || null)}
          />
        </div>
        <DatePicker
          dateFormat="MMMM d, yyyy"
          className="w-full shadow-inner border-2 border-blue-300 p-2 rounded-lg text-center"
          selected={activeDate}
          onChange={(date) => setActiveDate(date)}
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={searchCenters}
        >
          Search centers
        </button>
        {centerInfo && (
          <span className="text-xl rounded-lg border-2 text-gray-300 p-2">
            Appoinments available: {centerInfo?.appointmentsAvailableCount || 0}
          </span>
        )}
        {!!centerInfo?.centers.length && (
          <div className="p-8 flex flex-col gap-4 w-full overflow-scroll">
            {centerInfo?.centers.map((center, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex justify-between p-2 rounded-lg shadow-inner bg-white"
                >
                  <span className="text-lg">{center.name}</span>
                  <span className="rounded-lg  p-1 h-8 font-bold text-green-400">
                    {center.fee_type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
