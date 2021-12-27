import { PluginApi } from './@interface/pluginApi.i'
import {DiscordBridge} from './@interface/DiscordBridge.i'
import { MessageEmbed } from 'discord.js'
class DiscordBridgePlus {
    private api: PluginApi
    private plugin: DiscordBridge
    constructor(api: PluginApi) {
      this.api = api
    }
    public onEnabled(): void {
      const DiscordBridge = this.api.getPlugins().get("discordbridge")
      this.plugin = DiscordBridge.plugin as unknown as DiscordBridge
      this.plugin.getClient().on('ready',async()=>{
        const l = new MessageEmbed()
          .setColor('#000080')
          .setDescription(`DiscordBridge is now connected to **${this.api.getConnection().realm.name.replace(/§[0-9A-FK-OR]/ig,'')}**`)
        await this.plugin.sendEmbed(l)
        this.api.getEventManager().on('PlayerInitialized', async (p) => {
          const j = new MessageEmbed()
            .setColor('#00ff00')
            .setDescription(`**${p.getName()}** has joined the realm.`)
          await this.plugin.sendEmbed(j)
        })
        this.api.getEventManager().on('PlayerLeft', async (p) => {
          const l = new MessageEmbed()
            .setColor('#9d3838')
            .setDescription(`**${p.getName()}** has left the realm.`)
          await this.plugin.sendEmbed(l)
        })
        this.api.getEventManager().on('PlayerDied', async (p) => {
          var d = new MessageEmbed()
            .setColor('#202225')
          if(!p.killer) d = d.setDescription(`**${p.player.getName()}** ${p.cause.replace('attack.anvil','was squashed by a falling anvil.').replace('attack.cactus','was pricked to death.').replace('attack.drown','drowned.').replace('attack.explosion','blew up.').replace('attack.fall','hit the ground too hard.').replace('attack.fallingBlock','was squashed by a falling block.').replace('attack.fireworks','went off with a bang.').replace('attack.flyIntoWall','experienced kinetic energy.').replace('attack.generic','died. :(').replace('attack.inFire','went up in flames').replace('attack.inWall','suffocated in a wall.').replace('attack.lava','tried to swim in lava.').replace('attack.lightningBolt','was struck by lightning.').replace('attack.magic','was killed by magic.').replace('attack.magma','discovered the floor was lava.').replace('attack.onFire','burned to death.').replace('attack.outOfWorld','fell out of the world.').replace('attack.spit','was spitballed by a lama.').replace('attack.starve','starved to death.').replace('attack.wither','withered away.').replace('attack.freeze','froze to death.').replace('attack.stalactite','was skewered by a falling stalacite.').replace('attack.stalagmite','was impaled on a stalagmite.').replace('fell.accident.generic','fell from a high place.').replace('fell.accident.ladder','fell off a ladder.').replace('fell.accident.vines','fell off some vines.').replace('fell.accident.water','fell out of the water.').replace('fell.accident.killer','was doomed to fall...').replace('fell.accident','fell.').replace('attack','died. :(')}`);
          await this.plugin.sendEmbed(d)
        })
        this.api.getConnection().on('player_skin', async (ps) => {
          var d = new MessageEmbed()
            .setColor('#ffa200')
            .setDescription(`**${this.api.getPlayerManager().getPlayerByUUID(ps.uuid).getName()}** has change their skin.`)
          await this.plugin.sendEmbed(d)
        })
        this.plugin.getCommandManager().registerCommand({
          command: 'list',
          description: 'Get a list of players who are currently online.',
        },()=>{
          for (const [, c] of this.api.getConnection().getConnectionManager().getConnections()) {
            const api = c.getPlugins().get("discordbridge").api
            var l:string[] = [];
            for(const[,p] of api.getPlayerManager().getPlayerList()) {
              l.push('- '+p.getName())
            }
            const list = new MessageEmbed()
              .setColor("#5865F2")
              .setTitle(`**Showing all online players.**\n***[***​*${api.getConnection().realm.name.replace(/§[0-9A-FK-OR]/ig,'')}*​***]***`)
              .setDescription(l.join("\n"))
            this.plugin.sendEmbed(list)
          }
        })
      })

    }
    public onDisabled(): void {
      this.api.getLogger().info('Disabled!')
    }
}

export = DiscordBridgePlus
