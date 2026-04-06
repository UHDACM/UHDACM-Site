import { WrapInNavbarAndFooter } from "../_utils/tsxServerTools";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

export default function Page() {
  return (
    <WrapInNavbarAndFooter>
      <PrivacyPolicyContent />
    </WrapInNavbarAndFooter>
  );
}
