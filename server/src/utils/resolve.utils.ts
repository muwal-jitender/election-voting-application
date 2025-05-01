import { container } from "tsyringe";

/**
 * Resolve a class instance from the dependency injection container.
 *
 * @template T - The class or token to resolve
 * @param token - The class constructor or token used for resolution
 * @returns The resolved instance
 *
 * @example
 * const authService = resolve(AuthService);
 */
export function resolve<T>(token: new (...args: any[]) => T): T {
  return container.resolve<T>(token);
}
