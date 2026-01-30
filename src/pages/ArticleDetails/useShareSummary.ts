export function useShareSummary() {
  const share = (title?: string, text?: string) => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title, text, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  };

  return { share };
}
