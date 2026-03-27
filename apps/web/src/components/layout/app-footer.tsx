export function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background py-4 text-center text-sm text-muted-foreground">
      <p>© {year} Theodore Belo. All rights reserved.</p>
    </footer>
  );
}
