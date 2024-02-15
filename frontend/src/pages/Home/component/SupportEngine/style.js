export const style = {
    chatWithMeButton: {
        cursor: "pointer",
        boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)",
        // Border
        borderRadius: "50%",
        // Background
        backgroundImage: `url(https://www.bing.com/images/blob?bcid=r8J3UZlfi3kGwg)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "84px",
        // Size
        width: "84px",
        height: "84px",
    },
    avatarHello: {
        // Position
        position: "absolute",
        left: "calc(-100% - 94px)",
        top: "calc(50% - 24px)",
        // Layering
        zIndex: "10000",
        boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)",
        // Border
        padding: "12px 12px 12px 16px",
        borderRadius: "24px",
        // Color
        backgroundColor: "var(--btn-yellow-color)",
        color: "var(--btn-blue-color)",
    },
    supportWindow: {
        // Position
        position: "fixed",
        bottom: "116px",
        right: "24px",
        // Size
        width: "350px",
        height: "430px",
        maxWidth: "calc(100% - 48px)",
        maxHeight: "calc(100% - 48px)",
        backgroundColor: "white",
        // Border
        borderRadius: "12px",
        border: `2px solid var(--btn-yellow-color)`,
        overflow: "hidden",
        // Shadow
        boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)"
    },
    emailFormWindow: {
        width: "100%",
        overflow: "hidden",
        transition: "all 0.5s ease",
        WebkitTransition: "all 0.5s ease",
        MozTransition: "all 0.5s ease",
    },
    stripe: {
        position: "relative",
        top: "-45px",
        width: "100%",
        height: "308px",
        backgroundColor: "var(--btn-yellow-color)",
        transform: "skewY(-12deg)",
    },
    topText: {
        position: "relative",
        width: "100%",
        top: "15%",
        color: "var(--btn-blue-color)",
        fontSize: "24px",
        fontWeight: "600",
    },
    emailInput: {
        width: "66%",
        textAlign: "center",
        outline: "none",
        padding: "12px",
        borderRadius: "12px",
        border: "2px solid var(--btn-yellow-color)",
    },
    bottomText: {
        position: "absolute",
        width: "100%",
        top: "60%",
        color: "var(--btn-blue-color)",
        marginTop: "10px",
        padding: "0 50px",
        fontSize: "1.6rem",
        fontWeight: "600",
    },
    loadingDiv: {
        position: "absolute",
        height: "100%",
        width: "100%",
        textAlign: "center",
        backgroundColor: "white",
    },
    loadingIcon: {
        color: "#7a39e0",
        position: "absolute",
        top: "calc(50% - 51px)",
        left: "calc(50% - 51px)",
        fontWeight: "600",
    },
    chatEngineWindow: {
        width: "100%",
        backgroundColor: "#fff",
    },
};
