import MainHeroSection from "../_sections/MainHeroSection/MainHeroSection";

export default async function Page() {
  // const data = await fetchAPI("sisters", { populate: "*" });
  // console.log(data);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeroSection
        spanText="JOIN"
        title={`Reach Out!`}
        subtitle={`We’re just a couple clicks away!\nQuestions, Suggestions, Collaboration, Sponsors, etc.\n\nJust enter your email, leave a message, and we’ll reply to you in 24-48 hours.`}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        topLevelStyle={{
          paddingTop: '2.5rem'
        }}
        rightContent={
          <div style={{ width: "100%", height: "80vh" }}>
            <iframe
              src="https://forms.fillout.com/t/k8YWLofVmaus"
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "8px" }}
              title="Contact Us Form"
              allowFullScreen
            />
          </div>
        }
      />
    </div>
  );
}
