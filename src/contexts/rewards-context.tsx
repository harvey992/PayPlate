import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { rewardService } from "@/services/payplate-api";
import type { Reward, Challenge } from "@/types/payplate";

type RewardsState = {
  rewards: Reward[];
  challenges: Challenge[];
  isLoading: boolean;
  redeem: (rewardId: string) => boolean;
};

const RewardsContext = createContext<RewardsState | undefined>(undefined);

export function RewardsProvider({ children }: { children: ReactNode }) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([rewardService.getAll(), rewardService.getChallenges()]).then(([r, c]) => {
      if (active) { setRewards(r); setChallenges(c); setIsLoading(false); }
    });
    return () => { active = false; };
  }, []);

  const value = useMemo<RewardsState>(
    () => ({
      rewards, challenges, isLoading,
      redeem(rewardId) {
        setRewards((prev) => prev.map((r) => (r.id === rewardId ? { ...r, isEarned: true } : r)));
        return true;
      },
    }),
    [rewards, challenges, isLoading],
  );

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
}

export function useRewards() {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error("useRewards must be used within RewardsProvider");
  return ctx;
}
