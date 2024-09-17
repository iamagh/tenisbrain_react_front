declare module 'react-facebook-login' {
  interface ReactFacebookLoginProps {
    appId: string;
    callback: (response: any) => void;
    autoLoad?: boolean;
    fields?: string;
    scope?: string;
    onClick?: () => void;
    render?: (renderProps: { onClick: () => void; }) => JSX.Element;
    cookie?: boolean;
    xfbml?: boolean;
    version?: string;
    language?: string;
    disableMobileRedirect?: boolean;
    isMobile?: boolean;
    redirectUri?: string;
    state?: string;
    authType?: string;
    returnScopes?: boolean;
    responseType?: string;
    reAuthenticate?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    cssClass?: string;
    icon?: React.ReactNode;
    textButton?: string;
    typeButton?: string;
    size?: string;
    tag?: string;
  }

  const ReactFacebookLogin: React.FC<ReactFacebookLoginProps>;

  export default ReactFacebookLogin;
}
