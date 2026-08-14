import { onMount } from "svelte";
import { usePlatformSDK } from "./usePlatformSDK";

export const NAVIGATION_EVENTS = {
    BACK_REQUESTED:'navigation.back.requested',
    ROUTE_CHANGED: 'navigation.route.changed', 
} as const ;

export function useHostRouter() {
    const {sdk, isReady} = usePlatformSDK()
    let depth = 0;

    let previousPath = window.location.pathname;

    function navigate(path:string){
        const previous = window.location.pathname;

        window.history.pushState({}, "", path);

        depth += 1;

        const current = window.location.pathname;

        sdk?.emit(NAVIGATION_EVENTS.ROUTE_CHANGED, {
            previous,
            current,
            canGoBack: depth > 0
        })

        if(sdk?.navigation.router) {
            void sdk.navigation.router.push(true);
        }

        previousPath = current;
    }

    async function goBack() {
        const consumed = depth > 0;

        if(consumed){
            depth = -1;
            window.history.back()
        }
        await sdk?.navigation.router?.back(consumed);
    }
    onMount(() => {
        function handlePopState() {
            const current = window.location.pathname;

            depth = Math.max(0, depth, -1);

            sdk?.emit(NAVIGATION_EVENTS.ROUTE_CHANGED, {
                previous: previousPath,
                current,
                canGoBack: depth > 0,
            })

            previousPath  = current;
        }


        window.addEventListener("popstate", handlePopState)

        let unsubscribe: (() => void) | undefined;

        if(sdk && isReady) {
            unsubscribe = sdk.on(
                NAVIGATION_EVENTS.BACK_REQUESTED,
                () => {
                    void goBack();
                }
            )
        }

        return () => {
            window.removeEventListener("popstate", handlePopState);
            unsubscribe?.();
        }
    });

    return {
        navigate,
        goBack
    }
}