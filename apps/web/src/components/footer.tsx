import { Box, Flex, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { APP_VERSION, REPO_URL, studioUrl } from '@/lib/about';

/**
 * The line at the bottom every hosted page needs and a local one never
 * missed: what this is, which version, where the source is, and the one
 * promise a save-file tool has to make out loud.
 *
 * The hosted copy also counts visits, and says so here in the same breath as
 * the promise, because a privacy line that leaves that out is not true
 * ([ADR 37](../../../../docs/adr/0037-the-hosted-copy-counts-visits.md)). A
 * donate link appears only where one is configured.
 *
 * Factory Board is the Ludven studio's. The studio is always named; its app, support and privacy
 * pages are linked only once `FACTORY_BOARD_STUDIO_URL` says where they answer.
 */
export function Footer() {
  const counted = Boolean(process.env.FACTORY_BOARD_UMAMI_ID);
  const donate = process.env.FACTORY_BOARD_DONATE_URL;
  const studio = studioUrl();
  const app = studio ? `${studio}/apps/factory-board` : null;
  return (
    <Box as="footer" borderTopWidth="1px" borderColor="border.default" mt={16}>
      <Flex
        maxW="1320px"
        mx="auto"
        px={5}
        py={4}
        gap={4}
        wrap="wrap"
        align="baseline"
        fontFamily="mono"
        fontSize="11.5px"
        letterSpacing="0.06em"
        color="fg.subtle"
      >
        <Text>Factory Board v{APP_VERSION}</Text>
        {app ? <FooterLink href={`${app}/`}>A Ludven app</FooterLink> : <Text>A Ludven app</Text>}
        <Text>MIT</Text>
        <FooterLink href={REPO_URL}>Source on GitHub</FooterLink>
        {app ? <FooterLink href={`${app}/support/`}>Support</FooterLink> : null}
        {app ? <FooterLink href={`${app}/privacy/`}>Privacy</FooterLink> : null}
        {donate ? <FooterLink href={donate}>Buy me a coffee</FooterLink> : null}
        <Text flex="1" minW={{ base: 'auto', md: '40ch' }} textAlign={{ base: 'start', md: 'end' }}>
          Runs entirely in your browser. Your save is never uploaded.
          {counted ? ' Visits are counted, anonymously, with nothing from the save.' : ''}
        </Text>
      </Flex>
    </Box>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Box asChild color="fg.muted" _hover={{ color: 'accent.solid' }}>
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    </Box>
  );
}
