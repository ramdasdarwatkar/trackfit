import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOnboarding } from "../../hooks/useOnboarding";
import { GenderPicker } from "./components/GenderPicker";
import { RulerPicker } from "./components/RulerPicker";
import { LevelPicker } from "./components/LevelPicker";
import { Input } from "../../components/ui/Input";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { GenderType } from "../../types/database.types";

export const OnboardingPage = () => {
  // refreshProfile is the key to triggering the AppRoutes redirect
  const { user_id, refreshProfile } = useAuth();
  const { saveOnboarding } = useOnboarding();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "male" as GenderType,
    birthdate: "",
    height: 175,
    current_weight: 80,
    target_weight: 75,
    target_workout_days: 4,
    selected_level: "Novice",
    initial_points: 0,
  });

  // BMI Logic calculation for real-time feedback
  const bmiData = useMemo(() => {
    const h = formData.height / 100;
    const bmi = parseFloat((formData.current_weight / (h * h)).toFixed(1));
    if (bmi < 18.5)
      return { val: bmi, label: "Underweight", color: "text-yellow-500" };
    if (bmi < 25)
      return { val: bmi, label: "Healthy", color: "text-green-500" };
    if (bmi < 30)
      return { val: bmi, label: "Overweight", color: "text-orange-500" };
    return { val: bmi, label: "Obese", color: "text-red-500" };
  }, [formData.height, formData.current_weight]);

  // Dynamic encouragement text based on weight goals
  const weightDiff = formData.current_weight - formData.target_weight;
  const encouragementText = useMemo(() => {
    if (weightDiff > 0) return `That's a ${weightDiff}kg loss plan!`;
    if (weightDiff < 0) return `Targeting a ${Math.abs(weightDiff)}kg gain!`;
    return "Staying steady and strong!";
  }, [weightDiff]);

  const handleFinish = async () => {
    if (!user_id) return;
    setLoading(true);
    try {
      // 1. Save data across Supabase and Dexie
      await saveOnboarding(
        {
          user_id,
          name: formData.name,
          gender: formData.gender,
          birthdate: formData.birthdate,
          target_weight: formData.target_weight,
          target_days_per_week: formData.target_workout_days,
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        formData.current_weight,
        formData.height,
        formData.selected_level,
        formData.initial_points,
      );

      // 2. Trigger AuthContext to re-read Dexie and update 'profile' state
      // This flips the 'profile' state from null -> data, triggering the redirect
      await refreshProfile();
    } catch (err) {
      console.error("Onboarding Finish Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden pt-safe">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-900">
        <div
          className="h-full bg-brand transition-all duration-700 ease-in-out shadow-[0_0_15px_#0ea5e9]"
          style={{ width: `${(step / 6) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col px-8 pt-10 overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
              <header className="space-y-2">
                <h1 className="text-4xl font-black uppercase leading-tight">
                  First, <br />
                  the <span className="text-brand">Basics</span>
                </h1>
                <p className="text-slate-400 font-medium italic">
                  What should we call you?
                </p>
              </header>
              <div className="space-y-6">
                <Input
                  label="FULL NAME"
                  value={formData.name}
                  onChange={(e: any) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
                <p className="text-slate-400 font-medium italic">
                  And your gender?
                </p>
                <GenderPicker
                  value={formData.gender}
                  onChange={(g) => setFormData({ ...formData, gender: g })}
                />
                <p className="text-slate-400 font-medium italic">
                  Your birthday?
                </p>
                <Input
                  label="BIRTH DATE"
                  type="date"
                  className="w-full appearance-none bg-transparent m-0 block min-w-0" // Add these utilities
                  value={formData.birthdate}
                  onChange={(e: any) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 2: Height */}
          {step === 2 && (
            <div className="h-full flex flex-col justify-center text-center animate-in slide-in-from-right-8 duration-500">
              <Sparkles
                className="mx-auto mb-4 text-brand animate-pulse"
                size={32}
              />
              <h1 className="text-3xl font-black uppercase mb-2">
                Nice to meet you, <br />
                {formData.name.split(" ")[0] || "Athlete"}!
              </h1>
              <p className="text-slate-400 font-medium mb-10 italic">
                How tall are you?
              </p>
              <RulerPicker
                min={100}
                max={250}
                value={formData.height}
                unit="cm"
                onChange={(v) => setFormData({ ...formData, height: v })}
              />
            </div>
          )}

          {/* STEP 3: Current Weight */}
          {step === 3 && (
            <div className="h-full flex flex-col justify-center text-center animate-in slide-in-from-right-8 duration-500">
              <h1 className="text-3xl font-black uppercase mb-2 text-brand">
                Current Weight
              </h1>
              <p className="text-slate-400 font-medium mb-10 italic">
                Your starting point today
              </p>
              <RulerPicker
                min={30}
                max={200}
                value={formData.current_weight}
                unit="kg"
                onChange={(v) =>
                  setFormData({ ...formData, current_weight: v })
                }
              />
              <div className="mt-8 bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] flex justify-between items-center">
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                    Health Index (BMI)
                  </p>
                  <p
                    className={`text-lg font-black uppercase ${bmiData.color}`}
                  >
                    {bmiData.label}
                  </p>
                </div>
                <div className="text-5xl font-black italic tabular-nums text-slate-200">
                  {bmiData.val}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Target Weight */}
          {step === 4 && (
            <div className="h-full flex flex-col justify-center text-center animate-in slide-in-from-right-8 duration-500">
              <Target className="mx-auto mb-4 text-brand" size={40} />
              <h1 className="text-3xl font-black uppercase mb-2">
                Target Weight
              </h1>
              <p className="text-slate-400 font-medium mb-10 italic">
                What is your dream goal?
              </p>
              <RulerPicker
                min={30}
                max={200}
                value={formData.target_weight}
                unit="kg"
                onChange={(v) => setFormData({ ...formData, target_weight: v })}
              />
              <div className="mt-8 py-3 px-6 bg-brand/10 border border-brand/20 rounded-full inline-block mx-auto">
                <span className="text-brand font-bold uppercase tracking-tighter text-sm italic">
                  {encouragementText}
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Commitment */}
          {step === 5 && (
            <div className="h-full flex flex-col justify-center text-center animate-in slide-in-from-right-8 duration-500">
              <h1 className="text-4xl font-black uppercase mb-4 leading-tight">
                Commitment
              </h1>
              <p className="text-slate-400 font-medium mb-12 italic">
                How many days a week will you train?
              </p>
              <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setFormData({ ...formData, target_workout_days: d })
                    }
                    className={`w-10 h-10 rounded-full font-bold transition-all ${
                      formData.target_workout_days === d
                        ? "bg-brand text-white scale-150 shadow-lg shadow-brand/40"
                        : "text-slate-500"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Experience Level */}
          {step === 6 && (
            <div className="h-full flex flex-col justify-center animate-in slide-in-from-right-8 duration-500">
              <header className="text-center mb-6">
                <Trophy className="mx-auto mb-2 text-brand" size={32} />
                <h1 className="text-3xl font-black uppercase">Experience</h1>
                <p className="text-slate-400 font-medium italic">
                  Where should we start you off?
                </p>
              </header>
              <LevelPicker
                value={formData.selected_level}
                onChange={(name, pts) =>
                  setFormData({
                    ...formData,
                    selected_level: name,
                    initial_points: pts,
                  })
                }
              />
            </div>
          )}
        </div>

        {/* PERSISTENT FOOTER */}
        <footer className="py-10 flex gap-4 bg-black">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="h-16 w-16 rounded-3xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 active:scale-90 transition-transform"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <button
            onClick={step === 6 ? handleFinish : () => setStep((s) => s + 1)}
            disabled={loading || (step === 1 && !formData.name)}
            className="h-16 flex-1 bg-brand rounded-3xl font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl shadow-brand/20 disabled:opacity-30"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : step === 6 ? (
              "Ready to Go"
            ) : (
              "Continue"
            )}
            {step < 6 && <ChevronRight size={20} strokeWidth={3} />}
          </button>
        </footer>
      </div>
    </div>
  );
};
