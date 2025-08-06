import { Box, Heading, Text, Center, UnorderedList, ListItem, } from "@chakra-ui/react";

const TermsOfService = ({session}) => {
    return (
        <Center>
        <Box p={4} width="80%" m={8} borderRadius="md">
            <Heading>Terms of Service</Heading>
            <Text>
            The following terminology applies to these Terms and Conditions, Privacy Statement, and Disclaimer Notice and any or all Agreements: "Client," "You," and "Your" refers to you, the person accessing this website and accepting the Company's terms and conditions. "The Company," "Ourselves," "We," and "Us," refers to Mumma Labs, LLC. "Party," "Parties," or "Us," refers to both the Client and ourselves, or either the Client or ourselves. "The Product" shall refer to Forward, or other products used by creating a free or paid Mumma Labs user account. All terms refer to the offer, acceptance, and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a fixed duration or any other means, for the express purpose of meeting the Client's needs in respect of the provision of the Company's stated services/products, in accordance with and subject to, prevailing English Law. Any use of the above terminology or other words in the singular, plural, capitalization, and/or he/she or they, are taken as interchangeable and therefore as referring to the same. This is for https://www.theforwardapp.com, https://www.mumma.co/forward, and any apps being released on the Android Market and iOS App Store. The terms of use/agreement will be governed and interpreted by and under the laws of the state of Texas.
            </Text>
            <Heading as="h3" size="md" my={2}>Confidentiality</Heading>
            <Text>
            We are registered under the Data Protection Act and as such, any information concerning the Client and their respective Client Records may be passed to third parties. However, Client records are regarded as confidential and therefore will not be divulged to any third party unless legally required to do so to the appropriate authorities. Clients have the right to request sight of and copies of any and all Client Records we keep, on the proviso that we are given reasonable notice of such a request. Clients are requested to retain copies of any literature issued in relation to the provision of our services. Where appropriate, we shall issue Clients with appropriate written information, handouts, or copies of records as part of an agreed contract, for the benefit of both parties.
            </Text>
            <Text>
            We will not sell, share, or rent your personal information to any third party or use your e-mail address for unsolicited mail. Any emails sent by Mumma Labs will only be in connection with the provision of agreed services and products.
            </Text>
            <Heading as="h3" size="md" my={2}>Key Points</Heading>
            Location-based Service: Some features of the Service make use of detailed location information, for example, in the form of GPS signals and other information sent by your mobile device on which 
            <Text>
            Age: The Service is intended for use by users who are of the legal age of 17 and older. Minors can use the app if a guardian/parent is available.
            </Text>
            <Text>
            Software Update: The Software updates occur periodically.
            </Text>
            <Text>
            Supported API: The APIs are used within the app and the website, including Stripe.
            </Text>
            <Heading as="h3" size="md" my={2}>
            Internet Connectivity/Delays: 
            </Heading>
            <Text>
            This software/service is not liable for damage, delivery failures, construction for delivery service delays, or damage for other delays.
            You agree not to use our service for any criminal use.
            You agree that Mumma Labs does not make any guarantee regarding the quality of the services provided.
            You agree not to tamper, harm, or do anything with any code or try to hack into our services, involving the website and through our app.
            You agree that charges with your cellular provider like phone calls, text messages, and/or data charges may apply and are allowed.
            </Text>
            <Heading as="h3" size="md" my={2}>Automatic Updates</Heading>
            <Text>
            An automatic update can be released at any time. An update consists of such as bug fixes, patches, enhanced functions, missing plug-ins, and new versions of the app/website.
            </Text>

            <Heading as="h3" size="md" my={2}>Disclaimer Exclusions and Limitations</Heading>
            <Text>
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Mumma Labs: excludes all representations and warranties relating to this website and its contents or which is or may be provided by any affiliates or any other third party, including in relation to any inaccuracies or omissions in this website and/or the Company's literature; and excludes all liability for damages arising out of or in connection with your use of this website. This includes, without limitation, direct loss, loss of business or profits (whether or not the loss of such profits was foreseeable, arose in the normal course of things, or you have advised Mumma Labs of the possibility of such potential loss), damage caused to your computer, computer software, systems, and programs and the data thereon, or any other direct or indirect, consequential, and incidental damages. Mumma Labs does not, however, exclude liability for death or personal injury caused by its negligence. The above exclusions and limitations apply only to the extent permitted by law. None of your statutory rights as a consumer are affected.
            </Text>
            <Heading as="h3" size="md" my={2}>Apple</Heading>
            <Text>
            If you use the Service on an Apple device, then you agree and acknowledge that: Apple, Inc. bears no duties or obligations to you under the Terms, including, but not limited to, any obligation to furnish you with Service maintenance and support; You will have no claims, and you waive any and all rights and causes of action against Apple with respect to the Service or the Terms, including, but not limited to claims related to maintenance and support, intellectual property infringement, liability, consumer protection, or regulatory or legal conformance; Apple and Apple's subsidiaries are third-party beneficiaries of the Terms. Upon your acceptance of the Terms, Apple will have the right (and will be deemed to have accepted the right) to enforce these Terms against you as a third-party beneficiary thereof.
            </Text>

            <Heading as="h3" size="md" my={2}>Payments and Refund Policy</Heading>
            <Text>
            All payments for services are processed through Stripe. Mumma Labs is not responsible for any delays in payment processing due to Stripe's policies or procedures in providing its services. Personal Check with Bankers Card, all major Credit/Debit Cards are all acceptable methods of payment. Payment for any Mumma Labs service(s) is due in full within thirty days of the date that service is provided. All goods remain the property of the Company until paid for in full. Monies that remain outstanding by the due date will incur. The outstanding balance until such time as the balance is paid in full and final settlement. In such circumstances, you shall be liable for any and all additional administrative and/or court costs. Requests for refunds must be made only through email to forward@mumma.co. Refunds may be offered solely at Mumma Labs's discretion. In the event Mumma Labs offers the Client a refund, processing may take at least 7 business days.
            </Text>
            <Text>
            Mumma Labs or the Client may terminate any Services Agreement at any time and for any reason. Mumma Labs will not offer any refund for any portion of a Service(s) Mumma Labs has stated preparing or providing if the Client terminates the Services Agreement.
            </Text>
            <Heading as="h3" size="md" my={2}>
            Links from this website
            </Heading>
            <Text>
            We do not monitor or review the content of other party's websites which are linked to from this website. Opinions expressed or material appearing on such websites are not necessarily shared or endorsed by us and should not be regarded as the publisher of such opinions or material. Please be aware that we are not responsible for the privacy practices, or content, of these sites. We encourage our users to be aware when they leave our site & to read the privacy statements of these sites. You should evaluate the security and trustworthiness of any other site connected to this site or accessed through this site yourself, before disclosing any personal information to them. Mumma Labs will not accept any responsibility for any loss or damage in whatever manner, howsoever caused, resulting from your disclosure to third parties of personal information.
            </Text>
            <Heading as="h3" size="md" my={2}>Cookies</Heading>
            <Text>
            Like most interactive websites, Mumma Labs's website or ISP uses cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site to enable the functionality of this area and ease of use for those people visiting. Some of our affiliate partners may also use cookies.
            </Text>
            <Heading as="h3" size="md" my={2}>Log Files</Heading>
            <Text>
            We use IP addresses to analyze trends, administer the site, track user's movement, and gather broad demographic information for aggregate use. IP addresses are not linked to personally identifiable information. Additionally, for systems administration, detecting usage patterns and troubleshooting purposes, our web servers automatically log standard access information including browser type, access times/open mail, URL requested, and referral URL. This information is not shared with third parties and is used only within Mumma Labs on a need-to-know basis. Any individually identifiable information related to this data will never be used in any way different from that stated above without your explicit permission.
            </Text>
            <Heading as="h3" size="md" my={2}>Copyright Notice</Heading>
            <Text>
            Copyright and other relevant intellectual property rights exist on all text relating to the Company's services and the full content of this website.
            </Text>
            <Heading as="h3" size="md" my={2}>Communications</Heading>
            <Text>
            We have several different e-mail addresses for different queries. These and other contact information can be found on our Contact Us link on our website or via Company literature or via the Company's stated telephone, facsimile, or mobile telephone numbers. Mumma Labs is registered in the United States in North Carolina.
            </Text>
            <Heading as="h3" size="md" my={2}>General</Heading>
            <Text>
            The laws of the United States govern these terms and conditions. By accessing this website [and using our services/buying our products], you consent to these terms and conditions and to the exclusive jurisdiction of the US courts in all disputes arising out of such access. If any of these terms are deemed invalid or unenforceable for any reason (including, but not limited to, the exclusions and limitations set out above), then the invalid or unenforceable provision will be severed from these terms, and the remaining terms will continue to apply. Failure of the Company to enforce any of the provisions set out in these Terms and Conditions and any Agreement or failure to exercise any option to terminate shall not be construed as a waiver of such provisions and shall not affect the validity of these Terms and Conditions or of any Agreement or any part thereof or the right thereafter to enforce each and every provision. These Terms and Conditions shall not be amended, modified, varied, or supplemented except in writing and signed by duly authorized representatives of the Company.
            </Text>
            <Text>
            These terms and conditions form part of the Agreement between the Client and ourselves. Your accessing of this website and/or undertaking a booking or Agreement indicates your understanding, agreement to, and acceptance of the Disclaimer Notice and the full Terms and Conditions contained herein. Your statutory Consumer Rights are unaffected.
        </Text>
        </Box>
        </Center>
    );
};

export default TermsOfService;
