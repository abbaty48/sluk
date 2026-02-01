import { ArticlesFilter } from "@/pages/home/ArticlesFilter/ArticlesFilter";
import { HomeProvider } from "@/states/providers/homeProvider";
import { Articles } from "@/pages/home/Articles/Articles";
import { HomeHeader } from "./HomeHeader";


export function Home() {
  return (
    <HomeProvider>
      <div className="grid md:grid-cols-[max-content] md:grid-rows-[auto_1fr]">
        <HomeHeader />
        <ArticlesFilter />
        <Articles />
      </div>
    </HomeProvider>
  );
}
