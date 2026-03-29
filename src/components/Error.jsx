import React from "react";

export default function Error({ error }) {
  return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;
}
