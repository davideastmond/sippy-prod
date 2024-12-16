"use client";
import Router from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";

// https://stackoverflow.com/questions/75810823/general-approach-to-showing-indicator-that-page-is-loading-in-next-js
const LoadingWidget = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  return loading ? (
    <div className="fixed top-0 left-0 w-full h-full bg-stone-300 bg-opacity-90 z-50 flex justify-center items-center">
      <Spinner />
    </div>
  ) : null;
};

export default LoadingWidget;
