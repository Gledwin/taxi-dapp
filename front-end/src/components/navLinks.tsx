import { ReactNode } from 'react';
import { Link, LinkProps } from '@chakra-ui/react';

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  href: string;
}

const NavLink = ({ children, href, ...props }: NavLinkProps) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    textColor="green"
    _hover={{
      textColor: "black",
      textDecoration: "none",
    }}
    href={href}
    {...props} // Spread other props here, including className if needed
  >
    {children}
  </Link>
);

export default NavLink;
