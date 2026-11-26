import React from "react";
import GeneratedSearchPanel from "../evidence/GeneratedSearchPanel.jsx";

// TODO: replace this weak generated adapter with one owned debounced request
// effect, cleanup, abort signaling, and latest-settlement protection.
export default function SearchPanel(props) {
  return <GeneratedSearchPanel {...props} />;
}
