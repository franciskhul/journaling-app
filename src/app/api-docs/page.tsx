import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const swaggerUrl = "/api-docs/json";

  return (
    <div>
      <SwaggerUI url={swaggerUrl} />
    </div>
  );
}
