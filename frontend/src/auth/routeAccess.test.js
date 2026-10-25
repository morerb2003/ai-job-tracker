import assert from "node:assert/strict";
import test from "node:test";
import { getRouteAccess } from "./routeAccess.js";

test("route guard waits until session initialization completes", () => {
  assert.equal(
    getRouteAccess({ isLoading: true, isAuthenticated: false, userRole: null }),
    "loading"
  );
});

test("route guard sends anonymous visitors to authentication", () => {
  assert.equal(
    getRouteAccess({ isLoading: false, isAuthenticated: false, userRole: null }),
    "unauthenticated"
  );
});

test("route guard denies USER access to ADMIN routes", () => {
  assert.equal(
    getRouteAccess({
      isLoading: false,
      isAuthenticated: true,
      userRole: "USER",
      requiredRole: "ADMIN",
    }),
    "forbidden"
  );
});

test("route guard allows ADMIN access to ADMIN routes", () => {
  assert.equal(
    getRouteAccess({
      isLoading: false,
      isAuthenticated: true,
      userRole: "ADMIN",
      requiredRole: "ADMIN",
    }),
    "allowed"
  );
});

test("authenticated USER can access routes without a role restriction", () => {
  assert.equal(
    getRouteAccess({ isLoading: false, isAuthenticated: true, userRole: "USER" }),
    "allowed"
  );
});
