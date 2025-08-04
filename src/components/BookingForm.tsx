import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

// VR Experience options
const VR_EXPERIENCES = [
  { value: "carracing", label: "CAR - 8 racing games" },
  {
    value: "doublevregg",
    label: "DOUBLE VR EGG CHAIR - 200 games (variety of genres)",
  },
  { value: "ultimatecrossing", label: "ULTIMATE CROSSING 2 - 20 games" },
  { value: "vr360", label: "VR 360 - 14 games" },
  {
    value: "virtualrelaxation",
    label: "VIRTUAL RELAXATION - Relaxation experiences",
  },
  { value: "kindbear", label: "KIND BEAR - Children's adventures" },
];

// Participant options (1-10 people)
const PARTICIPANT_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} ${i === 0 ? "person" : "people"}`,
}));

// Generate available time slots for the next 14 days
function generateAvailableSlots() {
  const slots = [];
  const today = new Date();

  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);

    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Skip Mondays (closed)
    if (dayOfWeek === 1) continue;

    // Determine opening hours based on day
    let startHour, endHour;
    if (dayOfWeek === 0) {
      // Sunday
      startHour = 12;
      endHour = 18;
    } else {
      // Tuesday-Saturday
      startHour = 12;
      endHour = 20;
    }

    // Generate hourly slots, accounting for 30-minute break at 15:00-15:30
    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(currentDate);
      slotTime.setHours(hour, 0, 0, 0);

      // Skip if slot is during break time (15:00-15:30)
      if (hour === 15) {
        // Add 15:30 slot instead of 15:00
        const breakSlot = new Date(slotTime);
        breakSlot.setMinutes(30);

        if (breakSlot < new Date() && day === 0) continue; // Skip past times for today

        const dateStr = breakSlot.toLocaleDateString("en-GB");
        const timeStr = breakSlot.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // Create alphanumeric-only value for Stripe (format: DDMMYYYYHHMM)
        const alphanumericValue = `${breakSlot
          .getDate()
          .toString()
          .padStart(2, "0")}${(breakSlot.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${breakSlot.getFullYear()}${breakSlot
          .getHours()
          .toString()
          .padStart(2, "0")}${breakSlot
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        slots.push({
          value: alphanumericValue,
          label: `${dateStr} at ${timeStr}`,
          date: breakSlot,
        });
      } else {
        // Skip past time slots for today
        if (slotTime < new Date() && day === 0) continue;

        const dateStr = slotTime.toLocaleDateString("en-GB");
        const timeStr = slotTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // Create alphanumeric-only value for Stripe (format: DDMMYYYYHHMM)
        const alphanumericValue = `${slotTime
          .getDate()
          .toString()
          .padStart(2, "0")}${(slotTime.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${slotTime.getFullYear()}${slotTime
          .getHours()
          .toString()
          .padStart(2, "0")}${slotTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        slots.push({
          value: alphanumericValue,
          label: `${dateStr} at ${timeStr}`,
          date: slotTime,
        });
      }
    }
  }

  return slots.slice(0, 200); // Limit for performance
}

const BookingForm: React.FC = () => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [participants, setParticipants] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [availableSlots] = useState(() => generateAvailableSlots());

  // Handle VR experience selection (multiselect)
  const handleExperienceToggle = (experienceValue: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(experienceValue)
        ? prev.filter((exp) => exp !== experienceValue)
        : [...prev, experienceValue]
    );
  };

  const handleBooking = async () => {
    // Validation
    if (selectedExperiences.length === 0) {
      setError("Please select at least one VR experience");
      return;
    }

    if (!selectedSlot) {
      setError("Please select a preferred date and time");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get selected experience labels for metadata
      const selectedExperienceLabels = selectedExperiences.map(
        (value) =>
          VR_EXPERIENCES.find((exp) => exp.value === value)?.label || value
      );

      // Get selected slot label for metadata
      const selectedSlotData = availableSlots.find(
        (slot) => slot.value === selectedSlot
      );

      // Call the Netlify function to create Stripe checkout session
      const response = await fetch(
        "/.netlify/functions/create-stripe-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            success_url: `${window.location.origin}/success`,
            cancel_url: `${window.location.origin}/booking`,
            metadata: {
              vr_experiences: selectedExperiences.join(","),
              vr_experience_labels: selectedExperienceLabels.join(", "),
              participants: participants.toString(),
              booking_slot: selectedSlot,
              booking_slot_label: selectedSlotData?.label || "",
              booking_timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <section id="booking" className="bg-white mt-8 mb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="https://i.imgur.com/GAjV2PZ.png"
              alt="Virtual Adventure Killarney Logo"
              className="h-16 w-auto"
            />
          </div>
          <h2
            className="text-4xl font-bold text-blue-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {t("bookYourAdventure")}
          </h2>
          <p
            className="text-xl text-blue-700 mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {t("reserveYourSpot")}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-8">
          <div className="space-y-8">
            {/* VR Experiences Selection */}
            <div>
              <h3
                className="text-xl font-semibold text-blue-900 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Select VR Experiences (Choose one or more)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VR_EXPERIENCES.map((experience) => (
                  <label
                    key={experience.value}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExperiences.includes(experience.value)
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExperiences.includes(experience.value)}
                      onChange={() => handleExperienceToggle(experience.value)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span
                      className="text-sm text-blue-900"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {experience.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Participants Selection */}
            <div>
              <h3
                className="text-xl font-semibold text-blue-900 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Number of Participants
              </h3>
              <select
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {PARTICIPANT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Selection */}
            <div>
              <h3
                className="text-xl font-semibold text-blue-900 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Preferred Date & Time
              </h3>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <option value="">Select a date and time</option>
                {availableSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Summary */}
            {selectedExperiences.length > 0 && (
              <div className="bg-blue-100 p-6 rounded-lg">
                <h4
                  className="text-lg font-semibold text-blue-900 mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Booking Summary
                </h4>
                <div
                  className="space-y-2 text-sm text-blue-800"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <p>
                    <strong>VR Experiences:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {selectedExperiences.map((expValue) => {
                      const exp = VR_EXPERIENCES.find(
                        (e) => e.value === expValue
                      );
                      return <li key={expValue}>{exp?.label}</li>;
                    })}
                  </ul>
                  <p>
                    <strong>Participants:</strong> {participants}{" "}
                    {participants === 1 ? "person" : "people"}
                  </p>
                  {selectedSlot && (
                    <p>
                      <strong>Date & Time:</strong>{" "}
                      {
                        availableSlots.find((s) => s.value === selectedSlot)
                          ?.label
                      }
                    </p>
                  )}
                  <p className="mt-4 font-semibold">
                    <strong>Deposit:</strong> €10.00
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p
                  className="text-red-800 text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={
                isProcessing ||
                selectedExperiences.length === 0 ||
                !selectedSlot
              }
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                isProcessing ||
                selectedExperiences.length === 0 ||
                !selectedSlot
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Booking Session...</span>
                </div>
              ) : (
                "Complete Booking with €10 Deposit"
              )}
            </button>

            <p
              className="text-xs text-blue-600 text-center"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Secure payment processing powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
