import { useFilterState } from "@/hooks/useFilterState";
import { ArticleProvider } from "./ArticleProvider";
import { ArticleFilter } from "./ArticleFilter";
import { useArticle } from "./useArticle";

function ArticlesFilterContent() {
  const { showFilter, changeShowFilter } = useFilterState();
  const { resetFilter } = useArticle();

  return (
    showFilter && (
      <ArticleFilter
        onShowFilter={() => changeShowFilter(!showFilter)}
        onResetFilter={resetFilter}
      >
        {/*Filter by Category*/}
        <ArticleFilter.ListFilter caption={"Category"}>
          <ArticleFilter.List value={"all"} name={"All"} />
          <ArticleFilter.List value={"theses"} name={"Theses"} />
          <ArticleFilter.List value={"journals"} name={"Journals"} />
          <ArticleFilter.List value={"caseStudies"} name={"Case Studies"} />
          <ArticleFilter.List
            value={"researchPapers"}
            name={"Research Papers"}
          />
          <ArticleFilter.List
            value={"conferenceProceedings"}
            name={"Conference Proceedings"}
          />
        </ArticleFilter.ListFilter>
        {/*Seperator*/}
        <ArticleFilter.Seperator />
        {/*Filter by Year Range*/}
        <ArticleFilter.RangeFilter
          caption={"Publication Year"}
          start={1950}
          end={new Date().getUTCFullYear()}
          value={[1950, new Date().getUTCFullYear()]}
        />
        {/*Seperator*/}
        <ArticleFilter.Seperator />
        {/*Filter by File Types*/}
        <ArticleFilter.RadioFilter
          caption="File Type"
          name={"fileType"}
          value="all"
        >
          <ArticleFilter.RadioOption label={"All"} value="all" />
          <ArticleFilter.RadioOption label={"PDF"} value="pdf" />
          <ArticleFilter.RadioOption label={"DOC"} value="doc" />
          <ArticleFilter.RadioOption label={"EPUB"} value="epub" />
          <ArticleFilter.RadioOption label={"Video"} value="video" />
        </ArticleFilter.RadioFilter>
        {/*Seperator*/}
        <ArticleFilter.Seperator />
        {/*Search by author*/}
        <ArticleFilter.TextInput
          name={"author"}
          placeholder="Search articles by author."
        />
        {/*Seperator*/}
        <ArticleFilter.Seperator />
        {/**/}
        <ArticleFilter.Select
          value=""
          label="Languages"
          placeholder="Filter articles by languages."
        >
          <ArticleFilter.Option label="All" value="all" />
          <ArticleFilter.Option label="Hausa" value="hausa" />
          <ArticleFilter.Option label="Arabic" value="arabic" />
          <ArticleFilter.Option label="English" value="english" />
          <ArticleFilter.Option label="Chinese" value="chinese" />
          <ArticleFilter.Option label="French" value="french" />
        </ArticleFilter.Select>
      </ArticleFilter>
    )
  );
}

export function ArticlesFilter() {
  return (
    <ArticleProvider>
      <ArticlesFilterContent />
    </ArticleProvider>
  );
}
