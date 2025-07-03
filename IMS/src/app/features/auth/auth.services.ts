import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, tap, catchError, of, finalize, throwError } from "rxjs";
import { ApiResponse } from "../../shared/api-response.interface";
import { environment } from "../../../environment/environment.development"; // Adjust path if necessary

// Make sure your DTOs are correctly imported and defined
import { LoginRequestDto } from "../auth/dtos/login-request.dto"; // Adjusted path to reflect `auth` folder under `core` if moved
import { LoginResponseDto } from "../auth/dtos/loginResponse.dto"; // Adjusted path
import { CustomerRegisterRequestDto } from "../customer/dtos/customerRegisterRequest.dto";
import { CustomerRegisterResponseDto } from "../customer/dtos/customerRegisterResponse.dto";

export interface CurrentUser {
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService { // <--- RENAMED FROM LoginService

  private readonly currentUserSubject: BehaviorSubject<CurrentUser | null> = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$: Observable<CurrentUser | null> = this.currentUserSubject.asObservable();
  private readonly _authStatusReady = new BehaviorSubject<boolean>(false);
  public authStatusReady$ = this._authStatusReady.asObservable();

  constructor(private readonly http: HttpClient) {
    console.log("AuthService: Constructor called.");
    const storedRole = localStorage.getItem('role');
  if (storedRole) {
    this.currentUserSubject.next({ role: storedRole });
    this._authStatusReady.next(true);
  } else {
    this.loadUserRoleOnAppInit(); // fallback to API
  }
    // this.loadUserRoleOnAppInit();
  }

  loadUserRoleOnAppInit(): void {
    console.log("AuthService: Attempting to load user role on app initialization.");
    this.getRole().pipe(
      tap((response: ApiResponse<string>) => {
        if (response && response.isSuccess && response.message) {
          console.log("AuthService: Initial role fetched successfully from message:", response.message);
          this.saveRole(response.message);
        } else {
          console.log("AuthService: Initial role fetch did not return success or a valid role in message. User set to null.");
          this.currentUserSubject.next(null);
        }
      }),
      catchError((error) => {
        console.error("AuthService: Error fetching role during app init:", error);
        this.currentUserSubject.next(null);
        return of(null);
      }),
      finalize(() => {
        this._authStatusReady.next(true);
        console.log("AuthService: Initial role fetch complete, authStatusReady set to true.");
      })
    ).subscribe();
  }

  login(payload: LoginRequestDto): Observable<ApiResponse<LoginResponseDto>> {
    console.log("AuthService: Attempting login for user.");
    return this.http.post<ApiResponse<LoginResponseDto>>(
      `${environment.apiBaseUrl}/Auth/login`, payload, { withCredentials: true }
    ).pipe(
      tap((response: ApiResponse<LoginResponseDto>) => {
        if (response && response.data && response.data.success && response.data.role) {
          console.log("AuthService: Login successful. Saving role:", response.data.role);
          this.saveRole(response.data.role); // Save the role received from backend
          this._authStatusReady.next(true);
          console.log("AuthService: Login successful, authStatusReady set to true.");
        } else {
          console.warn("AuthService: Login response indicates failure or missing data.");
          this.currentUserSubject.next(null);
          this._authStatusReady.next(true);
        }
      }),
      catchError(error => {
        console.error("AuthService: Login failed due to API error:", error);
        this.currentUserSubject.next(null);
        this._authStatusReady.next(true);
        return throwError(() => new Error("Login failed, please try again."));
      })
    );
  }

  register(payload: CustomerRegisterRequestDto): Observable<ApiResponse<CustomerRegisterResponseDto>> {
    console.log("AuthService: Attempting registration for user.");
    return this.http.post<ApiResponse<CustomerRegisterResponseDto>>(
      `${environment.apiBaseUrl}/Auth/register`, payload
    ).pipe(
      tap((response: ApiResponse<CustomerRegisterResponseDto>) => {
        if (response && response.isSuccess) {
          console.log("AuthService: Registration successful.", response.message);
        } else {
          console.warn("AuthService: Registration response indicates failure:", response);
        }
      }),
      catchError(error => {
        console.error("AuthService: Registration failed due to API error:", error);
        return throwError(() => new Error("Registration failed, please try again."));
      })
    );
  }

  logout(): Observable<ApiResponse<string>> {
    console.log("AuthService: Attempting logout.");
    return this.http.post<ApiResponse<string>>(
      `${environment.apiBaseUrl}/Auth/logout`, {}, { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response && response.isSuccess) {
          console.log("AuthService: Logout successful from server.");
        } else {
          console.warn("AuthService: Logout response indicates server-side failure:", response);
        }
      }),
      finalize(() => {
        console.log("AuthService: Clearing local user session after logout attempt.");
        this.clearUserSession();
        this._authStatusReady.next(true);
      }),
      catchError(error => {
        console.error("AuthService: Error during logout API call:", error);
        this.clearUserSession();
        this._authStatusReady.next(true);
        return throwError(() => new Error("Logout failed."));
      })
    );
  }

  getCurrentUser(): CurrentUser | null {
    const user = this.currentUserSubject.value;
    console.log("AuthService: getCurrentUser called. Current user:", user ? user.role : 'null');
    return user;
  }

  isLoggedIn(): boolean {
    const loggedIn = this.currentUserSubject.value !== null;
    console.log("AuthService: isLoggedIn called. Status:", loggedIn);
    return loggedIn;
  }

  saveRole(role: string): void {
    console.log("AuthService: Saving role to BehaviorSubject:", role); // Log the exact role being saved
    localStorage.setItem('role', role); // <- this is new

    this.currentUserSubject.next({ role });
  }

  getRole(): Observable<ApiResponse<string>> {
    console.log("AuthService: Making API call to getRole.");
    return this.http.get<ApiResponse<string>>(
      `${environment.apiBaseUrl}/Auth/getRole`, { withCredentials: true }
    );
  }

  getUserRole(): CurrentUser | null {
    console.log("AuthService: getUserRole called. Returning current user value.");
    return this.currentUserSubject.value;
  }

  clearUserSession(): void {
    console.log("AuthService: clearUserSession called. Resetting user and auth status.");
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // if you're using this too
    this.currentUserSubject.next(null);
    this._authStatusReady.next(false);
  }

  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    const hasRole = currentUser !== null && currentUser.role === role;
    console.log(`AuthService: hasRole(${role}) called. Result: ${hasRole}`);
    return hasRole;
  }
}