import { useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav";
import FoodPage from "./pages/FoodPage";
import SettingsPage from "./pages/SettingsPage";
import StatsPage from "./pages/StatsPage";
import WheelPage from "./pages/WheelPage";
import type { AppData, Food, IntakeRecord, PageKey, Settings } from "./types";
import { todayKey } from "./utils/date";
import { loadData, saveData } from "./utils/storage";

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("wheel");
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const page = useMemo(() => {
    const updateData = (updater: (current: AppData) => AppData) => setData((current) => updater(current));

    if (activePage === "foods") {
      return (
        <FoodPage
          foods={data.foods}
          onSaveFood={(food: Food) =>
            updateData((current) => ({
              ...current,
              foods: current.foods.some((item) => item.id === food.id)
                ? current.foods.map((item) => (item.id === food.id ? food : item))
                : [food, ...current.foods],
            }))
          }
          onDeleteFood={(id: string) =>
            updateData((current) => ({
              ...current,
              foods: current.foods.filter((food) => food.id !== id),
            }))
          }
        />
      );
    }

    if (activePage === "stats") {
      return (
        <StatsPage
          records={data.records}
          onDeleteRecord={(id: string) =>
            updateData((current) => ({
              ...current,
              records: current.records.filter((record) => record.id !== id),
            }))
          }
          onClearToday={() =>
            updateData((current) => ({
              ...current,
              records: current.records.filter((record) => record.date !== todayKey()),
            }))
          }
        />
      );
    }

    if (activePage === "settings") {
      return (
        <SettingsPage
          data={data}
          settings={data.settings}
          onUpdateSettings={(settings: Settings) => updateData((current) => ({ ...current, settings }))}
          onImportData={setData}
        />
      );
    }

    return (
      <WheelPage
        foods={data.foods}
        records={data.records}
        settings={data.settings}
        onAddRecord={(record: IntakeRecord) =>
          updateData((current) => ({
            ...current,
            records: [record, ...current.records],
          }))
        }
      />
    );
  }, [activePage, data]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-5">
      {page}
      <BottomNav active={activePage} onChange={setActivePage} />
    </div>
  );
}
