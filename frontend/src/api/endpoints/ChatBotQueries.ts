import { useQuery } from "@tanstack/react-query";
import {
  fetchBusiestERSection,
  fetchMostCommonTriage,
  fetchAvgCommunicationsPerVisit,
  fetchWorstSatisfactionSection,
  fetchVisitsWithoutCommunication,
  fetchBusiestShift,
  fetchAvgTimeToFirstContactLWBS,
  fetchMostCommonFailureReason,
} from "@/api/chatbotAPI";

// 1
export const useBusiestERSection = () =>
  useQuery({
    queryKey: ["busiest-er-section"],
    queryFn: fetchBusiestERSection,
  });

// 2
export const useMostCommonTriage = () =>
  useQuery({
    queryKey: ["most-common-triage"],
    queryFn: fetchMostCommonTriage,
  });

// 3
export const useAvgCommunicationsPerVisit = () =>
  useQuery({
    queryKey: ["avg-communications-per-visit"],
    queryFn: fetchAvgCommunicationsPerVisit,
  });

// 4
export const useWorstSatisfactionSection = () =>
  useQuery({
    queryKey: ["worst-satisfaction-section"],
    queryFn: fetchWorstSatisfactionSection,
  });

// 5
export const useVisitsWithoutCommunication = () =>
  useQuery({
    queryKey: ["visits-without-communication"],
    queryFn: fetchVisitsWithoutCommunication,
  });

// 6
export const useBusiestShift = () =>
  useQuery({
    queryKey: ["busiest-shift"],
    queryFn: fetchBusiestShift,
  });

// 7
export const useAvgTimeToFirstContactLWBS = () =>
  useQuery({
    queryKey: ["avg-time-to-first-contact-lwbs"],
    queryFn: fetchAvgTimeToFirstContactLWBS,
  });

// 8
export const useMostCommonFailureReason = () =>
  useQuery({
    queryKey: ["most-common-failure-reason"],
    queryFn: fetchMostCommonFailureReason,
  });
