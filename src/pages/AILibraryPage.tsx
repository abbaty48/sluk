import { useState, useTransition } from "react";
import {
  Sparkles,
  Search,
  BookOpen,
  Quote,
  Lightbulb,
  FileText,
  Wand2,
  TrendingUp,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

/* ========================== TYPES ========================== */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  relevance?: number;
}

interface Citation {
  apa: string;
  mla: string;
  chicago: string;
  harvard: string;
}

/* ===================== AI RESEARCH CHAT ===================== */

function AIResearchChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI research assistant. I can help you understand papers, explain concepts, or find information in the library repository. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'd be happy to help you with "${input}". This is a demo response. In production, I would search the repository, analyze papers, and provide detailed insights based on your query.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          AI Research Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about papers, get summaries, and explore research topics
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <time className="text-xs opacity-70 mt-1 block">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about research papers..."
            disabled={isPending}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isPending}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==================== SMART SEARCH ==================== */

function SmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Paper[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!query.trim() || isPending) return;

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo results
      setResults([
        {
          id: "1",
          title: "Machine Learning Applications in Library Science",
          authors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
          year: 2024,
          abstract:
            "This paper explores how machine learning algorithms can enhance library catalog systems...",
          relevance: 95,
        },
        {
          id: "2",
          title: "Digital Preservation Using AI Techniques",
          authors: ["Dr. Emily Parker"],
          year: 2023,
          abstract:
            "An investigation into AI-powered methods for long-term digital preservation...",
          relevance: 87,
        },
      ]);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Smart Search
        </CardTitle>
        <CardDescription>
          Use natural language to find papers across the repository
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="E.g., 'papers about machine learning in libraries published after 2020'"
            disabled={isPending}
          />
          <Button onClick={handleSearch} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((paper) => (
              <div
                key={paper.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{paper.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {paper.authors.join(", ")} • {paper.year}
                    </p>
                    <p className="text-sm">{paper.abstract}</p>
                  </div>
                  {paper.relevance && (
                    <Badge variant="secondary" className="shrink-0">
                      {paper.relevance}% match
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ==================== CITATION GENERATOR ==================== */

function CitationGenerator() {
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [citations, setCitations] = useState<Citation | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    if (!paperTitle.trim() || isPending) return;

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setCitations({
        apa: `${authors} (${year}). ${paperTitle}. Journal Name, 10(2), 123-145.`,
        mla: `${authors}. "${paperTitle}." Journal Name, vol. 10, no. 2, ${year}, pp. 123-145.`,
        chicago: `${authors}. "${paperTitle}." Journal Name 10, no. 2 (${year}): 123-145.`,
        harvard: `${authors}, ${year}. ${paperTitle}. Journal Name, 10(2), pp.123-145.`,
      });
    });
  };

  const handleCopy = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="w-5 h-5" />
          Citation Generator
        </CardTitle>
        <CardDescription>
          Generate citations in multiple formats instantly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Input
            value={paperTitle}
            onChange={(e) => setPaperTitle(e.target.value)}
            placeholder="Paper title"
          />
          <Input
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="Authors (e.g., Smith, J., & Doe, A.)"
          />
          <Input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
          />
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Citations"
            )}
          </Button>
        </div>

        {citations && (
          <div className="space-y-3 pt-4 border-t">
            {Object.entries(citations).map(([format, citation]) => (
              <div key={format} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase">{format}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(format, citation)}
                  >
                    {copiedFormat === format ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm bg-muted p-3 rounded">{citation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ==================== PAPER RECOMMENDATIONS ==================== */

function PaperRecommendations() {
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState<Paper[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleGetRecommendations = () => {
    if (!interests.trim() || isPending) return;

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setRecommendations([
        {
          id: "1",
          title: "Advanced Neural Networks for Information Retrieval",
          authors: ["Dr. Alice Wong", "Prof. Robert Taylor"],
          year: 2024,
          abstract:
            "This research presents novel approaches to improving search accuracy...",
        },
        {
          id: "2",
          title: "Natural Language Processing in Academic Libraries",
          authors: ["Dr. James Miller"],
          year: 2023,
          abstract:
            "Exploring NLP techniques for enhancing user experience in digital libraries...",
        },
        {
          id: "3",
          title: "Knowledge Graphs for Research Discovery",
          authors: ["Prof. Maria Garcia", "Dr. Li Zhang"],
          year: 2024,
          abstract:
            "Building interconnected knowledge representations for academic research...",
        },
      ]);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Paper Recommendations
        </CardTitle>
        <CardDescription>
          Discover papers tailored to your research interests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Describe your research interests... (e.g., 'machine learning, information retrieval, digital libraries')"
            rows={3}
          />
          <Button
            onClick={handleGetRecommendations}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding Recommendations...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Recommended for you:</h4>
            {recommendations.map((paper) => (
              <div
                key={paper.id}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <h5 className="font-semibold text-sm mb-1">{paper.title}</h5>
                <p className="text-xs text-muted-foreground mb-2">
                  {paper.authors.join(", ")} • {paper.year}
                </p>
                <p className="text-xs">{paper.abstract}</p>
                <Button size="sm" variant="link" className="px-0 h-auto mt-2">
                  View Paper →
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ==================== RESEARCH INSIGHTS ==================== */

function ResearchInsights() {
  const [paperUrl, setPaperUrl] = useState("");
  const [insights, setInsights] = useState<{
    summary: string;
    keyFindings: string[];
    methodology: string;
    implications: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleExtract = () => {
    if (!paperUrl.trim() || isPending) return;

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setInsights({
        summary:
          "This paper investigates the application of transformer-based models in academic search systems, demonstrating a 23% improvement in retrieval accuracy compared to traditional methods.",
        keyFindings: [
          "Transformer models outperform BM25 by 23% in academic search tasks",
          "Fine-tuning on domain-specific data improves performance by additional 12%",
          "User satisfaction increased by 31% in controlled studies",
        ],
        methodology:
          "Comparative study using A/B testing with 10,000 university students over 6 months, measuring precision, recall, and user satisfaction metrics.",
        implications:
          "This research suggests academic libraries should consider adopting neural search technologies to improve user experience and research discovery.",
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Key Insights Extractor
        </CardTitle>
        <CardDescription>
          Extract main findings and insights from research papers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={paperUrl}
            onChange={(e) => setPaperUrl(e.target.value)}
            placeholder="Enter paper ID or URL"
          />
          <Button onClick={handleExtract} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Extract"
            )}
          </Button>
        </div>

        {insights && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Summary
              </h4>
              <p className="text-sm bg-muted p-3 rounded">{insights.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Key Findings
              </h4>
              <ul className="space-y-2">
                {insights.keyFindings.map((finding, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Methodology</h4>
              <p className="text-sm bg-muted p-3 rounded">
                {insights.methodology}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Implications</h4>
              <p className="text-sm bg-muted p-3 rounded">
                {insights.implications}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ==================== MAIN AI PAGE ==================== */

export const Component = function AILibraryPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wand2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">AI Research Tools</h1>
        </div>
        <p className="text-muted-foreground">
          Enhance your research with AI-powered tools designed for academic
          excellence
        </p>
      </div>

      {/* Feature Tabs */}
      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger value="citations" className="gap-2">
            <Quote className="w-4 h-4" />
            <span className="hidden sm:inline">Citations</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Recommend</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="writing" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Writing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <AIResearchChat />
        </TabsContent>

        <TabsContent value="search">
          <SmartSearch />
        </TabsContent>

        <TabsContent value="citations">
          <CitationGenerator />
        </TabsContent>

        <TabsContent value="recommendations">
          <PaperRecommendations />
        </TabsContent>

        <TabsContent value="insights">
          <ResearchInsights />
        </TabsContent>

        <TabsContent value="writing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Writing Assistant
              </CardTitle>
              <CardDescription>
                Get help drafting abstracts, research proposals, and literature
                reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Writing assistant feature coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Search className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.2M+</p>
                <p className="text-sm text-muted-foreground">Papers Indexed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">
                  AI Queries Today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
