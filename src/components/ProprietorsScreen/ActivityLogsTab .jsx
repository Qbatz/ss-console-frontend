import React from "react";
import msgBox from "../../assets/message-2.png";

const ActivityLogsTab = ({ activities }) => {

 return (
  <div className="bg-white rounded-xl px-4 py-3">

    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-8">

      {activities?.activities?.length > 0 ? (

        activities.activities.map((item, i) => (

          <div
            key={item.activityId}
            className="flex gap-4"
          >

            {/* Timeline */}
            <div className="flex flex-col items-center">

              <div className="w-10 h-10 rounded-full bg-[#EEF3FF] border border-[#D8E3FF] flex items-center justify-center">

                <img
                  src={msgBox}
                  alt="activity"
                  className="w-5 h-5 opacity-70"
                />

              </div>

              {i !== activities.activities.length - 1 && (
                <div className="w-[1px] flex-1 bg-gray-200 mt-1"></div>
              )}

            </div>

            {/* Content */}
            <div className="pb-6 text-left">

              <h3 className="text-[15px] font-semibold text-gray-800">
                {item.userName}
              </h3>

              <p className="text-[13px] text-gray-600 mt-1 leading-6">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">

                <span className="px-2 py-[2px] text-[11px] font-medium bg-blue-50 text-blue-600 rounded-full">
                  {item.activityType}
                </span>

                <span className="px-2 py-[2px] text-[11px] font-medium bg-gray-100 text-gray-600 rounded-full">
                  {item.platform || "N/A"}
                </span>

              </div>

              <p className="text-[12px] text-gray-400 mt-2">
                Added at {item.activityDate}, {item.activityTime}
              </p>

            </div>

          </div>

        ))

      ) : (

        <div className="text-center py-10 text-gray-400">
          No Activity Found
        </div>

      )}

    </div>

  </div>
);
};

export default ActivityLogsTab;