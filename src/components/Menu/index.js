import React from 'react';
import { Navbar, NavLink, NavItem, Nav } from 'reactstrap';
import { NavLink as RouterLink } from 'react-router-dom';

const menu = () => {
  return (
    <Navbar color="light" expand="md" light>
      <Nav className="me-auto" navbar>
        <NavItem>
          <NavLink tag={RouterLink} to="/">
            Countries
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RouterLink} to="/favorites">
            Favorites
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default menu;
