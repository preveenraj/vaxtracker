import { useState } from "react";
import Select from "react-select";

import { pingCowin } from "./cowin";
import districtConstants from "./constants/districts";

function App() {
  const [centerInfo, setCenterInfo] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);

  const searchCenters = async () => {
    console.log(activeDistrict);
    const data = await pingCowin({ districtId: activeDistrict });
    setCenterInfo(data);
  };

  return (
    <div className="h-screen py-10 px-4 md:px-10 flex justify-center items-center bg-gray-700">
      <div className="h-full w-full flex flex-col gap-2 items-center md:w-1/2 p-2 rounded-lg border-2 border-gray-300 bg-gray-100 shadow-inner">
        <Select
          isLoading={false}
          isClearable={true}
          isSearchable={true}
          error={false}
          className="w-full"
          name="districtList"
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary: "#194E92",
            },
          })}
          options={districtConstants["kerala"]}
          onChange={(selected) => setActiveDistrict(selected?.value || null)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={searchCenters}
        >
          Search centers for tomorrow
        </button>
        <span className="text-3xl">
          {centerInfo?.centers?.length}
        </span>
        <div className="p-8 flex flex-col gap-4 w-full overflow-scroll">
          {centerInfo?.centers.map((center) => {
            return (
              <div className="w-full flex justify-between p-2 rounded-lg shadow-inner bg-white">
                <span className="text-lg">{center.name}</span>
                <span className="rounded-lg  p-1 h-8 font-bold text-green-400">
                  {center.fee_type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
