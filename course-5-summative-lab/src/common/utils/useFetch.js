import { useEffect, useState } from "react";

//reduce fetch into a streamlined setup for repeated use
export default function useFetch(url, method="GET", onLoad = true) {//defaulting method to get and onLoad to true so get requests meant to run on load only need the url provided
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (onLoad) {
      runFetch();
    }
  }, []);

  function runFetch(body) {
    setLoading(true);
    fetch(url, compileFetchOptions(body))
      .then((r) => {
        setLoading(false);
        if (r.ok) {
          return r.json();
        }
      })
      .then((data) => setResponse(data))
      .catch((error) => console.error(error));
  }

  //compile options for fetch based on method and supplied body
  function compileFetchOptions(body) {
    if (method === "GET") {
      return null;
    }
    if (method === "POST" || method === "PATCH") {
      return {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };
    } else if (method === "DELETE") {
      return {
        method,
      };
    } else {
      console.warn("Invalid config: attempting fetch with default params");
      return null;
    }
  }

  return { response, loading, runFetch, setResponse };//returning setResponse for cases where component's useEffect is based on response
}
