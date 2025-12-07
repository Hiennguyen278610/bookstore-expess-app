export interface ProductsPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}
