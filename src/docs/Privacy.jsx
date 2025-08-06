import { Box, Heading, OrderedList, Text, UnorderedList, ListItem , Center} from "@chakra-ui/react";

const Privacy = ({session}) => {
    return (
        <>
        <Center>
        <Box p={4} width="80%" m={8} borderRadius="md">
            <Heading py={4}>Privacy Policy</Heading>
            <Text>
This privacy policy has been compiled to better serve those who are concerned with how their 'Personally identifiable information' (PII) is being used online. PII, as used in privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website and app.
</Text>
<Heading as="h3" size="md" my={2}>
What personal information do we collect from the people that visit our website or app?
</Heading>
<Text>
When ordering or registering on our site or app, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, credit card information, or other details to help you with your experience.
</Text>
<Heading as="h3" size="md" my={2}>
When do we collect information?
</Heading>
<Text>
We collect information from you when you register on our site or app, fill out a form or enter information.
</Text>
<Heading as="h3" size="md" my={2}>
How do we use your information?
</Heading>
<Text>
We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:
</Text>
<UnorderedList>
<ListItem>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</ListItem>
<ListItem>To administer a contest, promotion, survey, or other site feature.</ListItem>
<ListItem>To process your transactions quickly.</ListItem>
<ListItem>To send periodic emails regarding your order or other products and services.</ListItem>
</UnorderedList>
<Heading as="h3" size="md" my={2}>
How do we protect your information?
</Heading>
<Text>
We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
</Text>
<Heading as="h3" size="md" my={2}>
Cookies:
</Heading>
<Text>
Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
</Text>
<Heading as="h3" size="md" my={2}>
Third Party Disclosure:
</Heading>
<Text>
We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website or app, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
</Text>
<Text>We proudly do not use Google Analytics. Google sucks and we don't want them to have your data.</Text>
<Heading as="h3" size="md" my={2}>
COPPA (Children Online Privacy Protection Act):
</Heading>
<Text>
When it comes to the collection of personal information from children under 13, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the nation's consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online. We do not specifically market to children under 13.
</Text>
<Heading as="h3" size="md" my={2}>
Fair Information Practices:
</Heading>
<Text>
The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information. In order to be in line with Fair Information Practices, we will take the following responsive action, should a data breach occur: Within 14 Business Days We will notify the users via in-site notification within 14 Business Days. We also agree to the individual redress principle, which requires that individuals have a right to pursue legally enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights
            </Text>
        </Box>
        </Center>
        </>
    );
};

export default Privacy;
