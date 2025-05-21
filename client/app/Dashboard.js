"use client";

import React from "react";
import { NotificationsProvider } from "./context/NotificationsContext";

const NotificationsConfig = ({ children }) => {
  return <NotificationsProvider>{children}</NotificationsProvider>;
};

export default NotificationsConfig;
