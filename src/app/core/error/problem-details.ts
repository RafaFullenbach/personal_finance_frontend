export interface ApiProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  code?: string | null;
}
