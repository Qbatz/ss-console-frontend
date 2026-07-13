import React from "react";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";
import swap from "../../assets/arrowswap.png";
const OverviewSubscriptions = ({ hostelData }) => {
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Subscriptions");
  const currentSub = hostelData?.currentSubscription;
  console.log("hostelData", hostelData)
  return (
    <>
    {canRead === false ? (

  <div
    className="
      flex
      flex-col
      items-center
      justify-center
      h-[350px]
      gap-4
    "
  >

    <img
      src={LoginImg}
      alt="Access Restricted"
      className="
        w-64
        object-contain
      "
    />

    <p
      className="
        text-dangerRed
        text-cardTitle
        font-medium
        font-inter
      "
    >
      Access Restricted
    </p>

  </div>

) : (

  <div
    className="
      px-5
      py-4
      space-y-sectionGap
    "
  >

    {/* CURRENT */}
    <div>

      <h3
        className="
          text-cardTitle
          font-semibold
          text-headingDark
          mb-3
          font-inter text-start
        "
      >
        Current
      </h3>

      <div
        className="
          bg-white-common
          border
          border-borderSoft
          rounded-card
          overflow-x-auto
          shadow-card
        "
      >

        <table className="w-full">

          {/* HEADER */}
          <thead
            className="
              bg-cardBg
            "
          >

            <tr>

              {[
                "SUB PLAN",
                "BILLING CYCLE",
                "PLAN AMOUNT",
                "PAID AMOUNT",
                "DISCOUNT AMOUNT",
                "DUE DATE",
                "RENEWAL STATUS"
              ].map((header) => (

                <th
                  key={header}
                  className="
                    px-4
                    py-3
                    text-left
                    whitespace-nowrap
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      font-semibold
                      text-tableHeader
                      uppercase
                      text-textDark/60
                      font-inter
                    "
                  >

                    {header}

                    <img
                      src={swap}
                      className="
                        w-3
                        h-3
                        opacity-70
                      "
                    />

                  </div>

                </th>

              ))}

            </tr>

          </thead>

          {/* BODY */}
          <tbody
            className="
              divide-y
              divide-borderSoft 
            "
          >

            {currentSub ? (

              <tr
                className="
                  hover:bg-cardBg
                  transition-all
                "
              >

                <td
                  className="
                    px-4
                    py-3
                    text-tableCell
                    font-medium
                    whitespace-nowrap
                    text-textDark text-left
                  "
                >
                  {currentSub.planName || "N/A"}
                </td>

                <td
                  className="
                    px-4
                    py-3
                    text-tableCell
                    font-medium
                    whitespace-nowrap
                    text-textDark text-left
                  "
                >
                  {currentSub.planStartsAt} - {currentSub.planEndsAt}
                </td>

                <td
                  className="
                    px-4
                    py-3
                    text-tableCell
                    font-medium
                    whitespace-nowrap
                    text-textDark text-left
                  "
                >
                  ₹ {currentSub.planAmount ?? 0}
                </td>

                <td
                  className="
                    px-4
                    py-3
                    text-tableCell
                    font-medium
                    whitespace-nowrap
                    text-textDark text-left
                  "
                >
                  ₹ {currentSub.paidAmount ?? 0}
                </td>

                <td
                  className="
                    px-4
                    py-3
                    text-tableCell
                    font-medium
                    whitespace-nowrap
                    text-textDark text-left
                  "
                >
                  ₹ {currentSub.discountAmount ?? 0}
                </td>

                <td
                  className="
                    px-4
                    py-3
                    text-tableCell
                    font-medium
                    whitespace-nowrap
                    text-textDark text-left
                  "
                >
                  {currentSub.planEndsAt || "N/A"}
                </td>

                <td
                  className="
                    px-4
                    py-3
                    whitespace-nowrap text-left
                  "
                >

                  <span
                    className={`
                      px-2
                      py-1
                      rounded-pill
                      text-[11px]
                      font-medium

                      ${
                        hostelData?.subscriptionStatus?.toLowerCase() === "active"
                          ? "bg-green-50 text-successGreen"
                          : "bg-red-50 text-dangerRed"
                      }
                    `}
                  >
                    {hostelData?.subscriptionStatus || "N/A"}
                  </span>

                </td>

              </tr>

            ) : (

              <tr>

                <td
                  colSpan={7}
                  className="
                    text-center
                    py-6
                    text-textDark/40
                    text-cardTitle
                  "
                >
                  No Current Subscription
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

    {/* HISTORY */}
    <div>

      <h3
        className="
          text-cardTitle
          font-semibold
          text-headingDark
          mb-3
          font-inter text-start
        "
      >
        History
      </h3>

      <div
        className="
          bg-white-common
          border
          border-borderSoft
          rounded-card
          overflow-x-auto
          shadow-card
        "
      >

        <div
          className="
            max-h-[320px]
            overflow-y-auto
          "
        >

          <table className="w-full">

            {/* HEADER */}
            <thead
              className="
                bg-cardBg
                sticky
                top-0
                z-10
              "
            >

              <tr>

                {[
                  "SUB PLAN",
                  "BILLING CYCLE",
                  "PLAN AMOUNT",
                  "PAID AMOUNT",
                  "DISCOUNT AMOUNT",
                  "DUE DATE"
                ].map((header) => (

                  <th
                    key={header}
                    className="
                      px-4
                      py-3
                      text-left
                      whitespace-nowrap
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        font-semibold
                        text-tableHeader
                        uppercase
                        text-textDark/60
                        font-inter
                      "
                    >

                      {header}

                      <img
                        src={swap}
                        className="
                          w-3
                          h-3
                          opacity-70
                        "
                      />

                    </div>

                  </th>

                ))}

              </tr>

            </thead>

            {/* BODY */}
            <tbody
              className="
                divide-y
                divide-borderSoft
              "
            >

              {hostelData?.subscriptions &&
              hostelData.subscriptions.length > 0 ? (

                hostelData.subscriptions.map((sub) => (

                  <tr
                    key={sub.subscriptionId}
                    className="
                      hover:bg-cardBg
                      transition-all
                    "
                  >

                    <td
                      className="
                        px-4
                        py-3
                        text-tableCell
                        font-medium
                        whitespace-nowrap
                        text-textDark text-left
                      "
                    >
                      {sub.planName || "N/A"}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-tableCell
                        font-medium
                        whitespace-nowrap
                        text-textDark text-left
                      "
                    >
                      {sub.planStartsAt || "N/A"} - {sub.planEndsAt || "N/A"}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-tableCell
                        font-medium
                        whitespace-nowrap
                        text-textDark text-left
                      "
                    >
                      ₹ {sub.planAmount ?? 0}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-tableCell
                        font-medium
                        whitespace-nowrap
                        text-textDark text-left
                      "
                    >
                      ₹ {sub.paidAmount ?? 0}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-tableCell
                        font-medium
                        whitespace-nowrap
                        text-textDark text-left
                      "
                    >
                      ₹ {sub.discountAmount ?? 0}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-tableCell
                        font-medium
                        whitespace-nowrap
                        text-textDark text-left
                      "
                    >
                      {sub.planEndsAt || "N/A"}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="
                      text-center
                      py-6
                      text-textDark/40
                      text-cardTitle
                    "
                  >
                    No Data Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  </div>

)}
    </>
  );
};

export default OverviewSubscriptions;
