import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import MultiToggle from "react-multi-toggle";

import { pingCowin } from "./cowin";
import districtConstants from "./constants/districts";
import { getNextDate } from "./dateutils";

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

const districtOptions = [
  {
    displayName: "KL",
    value: "kerala",
  },
  {
    displayName: "TN",
    value: "tamilnadu",
  },
  {
    displayName: "KA",
    value: "karnataka",
  },
  {
    displayName: "WB",
    value: "westbengal",
  },
];

const App = () => {
  const [centerInfo, setCenterInfo] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeState, setActiveState] = useState(districtOptions[0].value);
  const [activeAgeCategory, setActiveAgeCategory] = useState(ageList[1]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeDate, setActiveDate] = useState(getNextDate(new Date()));
  const [
    appoinmentsAvailableTillNextWeek,
    setAppoinmentsAvailableTillNextWeek,
  ] = useState(0);
  const [
    appoinmentDatesTillNextWeek,
    setAppoinmentDatesTillNextWeek,
  ] = useState([]);

  const searchCenters = async () => {
    if (activeDistrict) {
      setIsLoading(true);
      const data = await pingCowin({
        districtId: activeDistrict?.value,
        ageValue: activeAgeCategory?.value,
        date: activeDate,
      });
      let dateCount = 2;
      let nextDate = getNextDate(activeDate);
      let totalAppoinmentsAvailable = data.appointmentsAvailableCount;
      let appoinmentDates = [data.nearestAppoinmentDate];
      while (dateCount++ <= 7) {
        const {
          appointmentsAvailableCount,
          nearestAppoinmentDate,
        } = await pingCowin({
          districtId: activeDistrict?.value,
          ageValue: activeAgeCategory?.value,
          date: nextDate,
        });
        totalAppoinmentsAvailable += appointmentsAvailableCount;
        if (nearestAppoinmentDate) {
          appoinmentDates.push(nearestAppoinmentDate);
        }
        nextDate = getNextDate(nextDate);
      }
      setAppoinmentsAvailableTillNextWeek(totalAppoinmentsAvailable);
      setAppoinmentDatesTillNextWeek(appoinmentDates.reverse());

      setCenterInfo(data);
      setIsLoading(false);
    }
  };
  return (
    <div className="h-screen py-12 px-4 md:px-10 flex justify-center items-center bg-gray-700">
      <div className="absolute top-2 flex gap-2 w-full">
        <MultiToggle
          options={districtOptions}
          className="px-12 gap-2"
          selectedOption={activeState}
          onSelectOption={(e) => {
            setActiveState(e);
            setActiveDistrict(null);
            setCenterInfo(null);
          }}
        />
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
            onChange={(selected) => {
              setActiveDistrict(selected || null);
              setCenterInfo(null);
            }}
          />
          <Select
            isLoading={false}
            placeholder={"Select Age Category"}
            error={false}
            isSearchable={false}
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
            onChange={(selected) => {
              setActiveAgeCategory(selected || null);
              setCenterInfo(null);
            }}
          />
        </div>
        <DatePicker
          dateFormat="MMMM d, yyyy"
          className="w-full shadow-inner border-2 border-blue-300 p-2 rounded-lg text-center"
          selected={activeDate}
          onChange={(date) => {
            setActiveDate(date);
            setCenterInfo(null);
          }}
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={searchCenters}
        >
          Search centers
        </button>
        {centerInfo && (
          <>
            <span className="text-xl rounded-lg border-2 text-gray-400 p-2">
              {centerInfo?.appointmentsAvailableCount || "No"} appoinment
              {centerInfo?.appointmentsAvailableCount > 1 ? "s" : ""} for the
              date
            </span>
            {appoinmentsAvailableTillNextWeek ? (
              <>
                <span className="text-md rounded-lg border-2 text-gray-300 p-2 flex justify-center text-center">
                  And no worries, there are {appoinmentsAvailableTillNextWeek}{" "}
                  appoinments available till {appoinmentDatesTillNextWeek[0]}
                </span>
                <span
                  className="text-gray-500 rounded-lg p-1 hover:text-green-500 font-bold cursor-pointer"
                  onClick={() =>
                    (window.location.href =
                      "https://selfregistration.cowin.gov.in/")
                  }
                >
                  Register Now
                </span>
              </>
            ) : (
              <span className="text-5xl font-bold rounded-lg h-full flex justify-center border-2 text-gray-300 p-4">
                Sorry, there are no appoinments for the next 7 days, please try
                later.
              </span>
            )}
          </>
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
                  {center.fee_type === "Free" ? (
                    <span className="rounded-lg  p-1 h-8 font-bold text-green-400">
                      {center.fee_type}
                    </span>
                  ) : (
                    <span className="rounded-lg  p-1 h-8 font-bold text-yellow-500">
                      {center.fee_type}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
