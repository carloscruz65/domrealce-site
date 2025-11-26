declare module './Plasmic-ini' {
  import { InitOptions, initPlasmicLoader } from '@plasmicapp/loader-react';
  export const PLASMIC: ReturnType<typeof initPlasmicLoader>;
}
