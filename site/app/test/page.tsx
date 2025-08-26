import Button from "../_components/Button/Button";
import Page404 from "../not-found";

export default async function Page() {
  return (
    <Page404
      customMessage={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: '1rem'
          }}
        >
          <span>
            So... you're not supposed to see this page, but here you are!{" "}
          </span>
          <Button target="_blank" href="https://www.youtube.com/watch?v=qyYHWkVWQ4o&pp=ygURa2lsbGVyIGJlYW4gbW92aWU%3D">
            Here's your prize
          </Button>
        </div>
      }
    />
  );
}
