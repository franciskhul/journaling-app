"use client";

import "swagger-ui-react/swagger-ui.css";
import SwaggerUI from "swagger-ui-react";

export default function ApiDocsPage() {
  const swaggerUrl = "/api-docs/json";

  return <SwaggerUI url={swaggerUrl} />;
}
