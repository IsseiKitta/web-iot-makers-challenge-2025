interface NavigationFooterProps {
  activeTab: "home" | "temperature" | "location";
  setActiveTab: (tab: "home" | "temperature" | "location") => void;
}

export default function NavigationFooter({ activeTab, setActiveTab }: NavigationFooterProps) {
  return (
    <div className="w-full flex justify-center items-end gap-[30px] h-[77px] pb-4">
      <button
        onClick={() => setActiveTab("home")}
        className="flex flex-col items-center gap-[10px] p-[16px] pb-[14px] w-[68px] text-foreground"
      >
        <div className="w-[40px] h-[40px] flex items-center justify-center">
          {/* Home Icon */}
          <svg width="31" height="32" viewBox="0 0 31 32" fill="none">
            <path
              d="M15.5 2.82L28 14.32V29H21V19H10V29H3V14.32L15.5 2.82Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
        {activeTab === "home" && (
          <div className="w-[31px] h-[2px] bg-primary"></div>
        )}
      </button>

      <button
        onClick={() => setActiveTab("temperature")}
        className="flex flex-col justify-center items-center gap-[10px] p-[16px] pb-[14px] w-[68px] text-foreground"
      >
        <div className="w-[40px] h-[40px] flex items-center justify-center">
          {/* Temperature Icon */}
          <svg width="18" height="32" viewBox="0 0 18 32" fill="none">
            <path
              d="M9 4C7.5 4 6.25 5.25 6.25 6.75V18.5C5.25 19.25 4.5 20.5 4.5 22C4.5 24.75 6.75 27 9.5 27C12.25 27 14.5 24.75 14.5 22C14.5 20.5 13.75 19.25 12.75 18.5V6.75C12.75 5.25 11.5 4 10 4H9Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {activeTab === "temperature" && (
          <div className="w-[31px] h-[2px] bg-primary"></div>
        )}
      </button>

      <button
        onClick={() => setActiveTab("location")}
        className="flex flex-col justify-center items-center gap-[10px] p-[16px] pb-[14px] w-[68px] text-foreground"
      >
        <div className="w-[40px] h-[40px] flex items-center justify-center">
          {/* Location Icon */}
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
            <path
              d="M12 4C8.5 4 5.5 7 5.5 10.5C5.5 15.5 12 28 12 28S18.5 15.5 18.5 10.5C18.5 7 15.5 4 12 4ZM12 13C10.5 13 9.25 11.75 9.25 10.25S10.5 7.5 12 7.5S14.75 8.75 14.75 10.25S13.5 13 12 13Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {activeTab === "location" && (
          <div className="w-[31px] h-[2px] bg-primary"></div>
        )}
      </button>
    </div>
  );
}