import type { ViteDevServer } from 'vite';
import lt from 'localtunnel';
import type { AddressInfo } from 'node:net';

type PluginOptions = lt.TunnelConfig & { timeout?: number };

export default (opts: PluginOptions) => ({
  name: 'localtunnel-server',
  enforce: 'post',
  apply: 'serve',
  configureServer(server: ViteDevServer) {
    let tunnel: lt.Tunnel;
    const logger = server.config.logger;

    server.httpServer?.once('listening', async () => {
      const address = server.httpServer!.address();
      const isAddressInfo = (x: any): x is AddressInfo => x?.address;
      if (!isAddressInfo(address)) {
        logger.error(
          'Could not retrieve ViteDevServer address. localtunnel could not start',
          {
            timestamp: true,
          }
        );
        return;
      }

      if (tunnel != null) {
        await tunnel.close();
      }

      await new Promise((r) => setTimeout(r, opts.timeout ?? 1000));
      tunnel = await lt({
        port: address.port,
        subdomain: opts?.subdomain,
      });

      logger.info('\nlocaltunnel has started!\n');
      server.resolvedUrls?.network.push(tunnel.url);
      server.printUrls();
    });
    server.httpServer?.on('close', async () => {
      if (tunnel != null) {
        await tunnel.close();
        logger.info('Shutting down localtunnel');
      }
    });
  },
});
