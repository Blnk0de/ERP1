import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Drawer = 'notifications' | 'workspace' | null;

type Metric = {
  label: string;
  value: string;
  detail: string;
  tone: 'green' | 'blue' | 'amber';
};

const metrics: Metric[] = [
  { label: 'Ventas netas', value: '$128,430', detail: '+12.8% vs. mes anterior', tone: 'green' },
  { label: 'Pedidos activos', value: '248', detail: '32 requieren atencion', tone: 'blue' },
  { label: 'Stock critico', value: '17 SKUs', detail: 'En 4 almacenes', tone: 'amber' },
];

const commands = ['Ir a ventas', 'Abrir inventario', 'Crear pedido', 'Cambiar espacio de trabajo'];

export default function App() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [drawer, setDrawer] = useState<Drawer>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((isOpen) => !isOpen);
      }
      if (event.key === 'Escape') {
        setCommandOpen(false);
        setDrawer(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const visibleCommands = commands.filter((command) =>
    command.toLowerCase().includes(commandQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <View style={styles.sidebar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>N</Text></View>
            <Text style={styles.brandName}>NEXUS ERP</Text>
          </View>
          <Text style={styles.eyebrow}>OPERACIONES</Text>
          <NavItem label="Resumen" active />
          <NavItem label="Ventas" />
          <NavItem label="Inventario" />
          <NavItem label="Compras" />
          <NavItem label="Finanzas" />
          <View style={styles.sidebarBottom}>
            <Text style={styles.eyebrow}>ESPACIO ACTUAL</Text>
            <Pressable style={styles.workspaceButton} onPress={() => setDrawer('workspace')}>
              <View style={styles.workspaceDot} />
              <View style={styles.workspaceCopy}>
                <Text style={styles.workspaceName}>Acme Retail</Text>
                <Text style={styles.workspaceMeta}>Produccion</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.topbar}>
            <View>
              <Text style={styles.breadcrumb}>ACME RETAIL / RESUMEN</Text>
              <Text style={styles.pageTitle}>Buenos dias, Mariana</Text>
            </View>
            <View style={styles.topbarActions}>
              <Pressable style={styles.commandTrigger} onPress={() => setCommandOpen(true)}>
                <Text style={styles.searchIcon}>⌕</Text>
                <Text style={styles.commandTriggerText}>Buscar en Nexus</Text>
                <Text style={styles.shortcut}>⌘ K</Text>
              </Pressable>
              <Pressable style={styles.iconButton} onPress={() => setDrawer('notifications')} accessibilityLabel="Abrir notificaciones">
                <Text style={styles.iconText}>◌</Text>
                <View style={styles.notificationDot} />
              </Pressable>
              <View style={styles.avatar}><Text style={styles.avatarText}>MR</Text></View>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.dashboard}>
            <View style={styles.heroRow}>
              <View>
                <Text style={styles.sectionKicker}>MARTES, 22 SEPTIEMBRE 2026</Text>
                <Text style={styles.heroTitle}>Todo bajo control.</Text>
                <Text style={styles.heroCopy}>Una vista precisa de tu operacion, en tiempo real.</Text>
              </View>
              <Pressable style={styles.primaryButton} onPress={() => setCommandOpen(true)}>
                <Text style={styles.primaryButtonText}>+ Nuevo pedido</Text>
              </Pressable>
            </View>

            <View style={styles.metricsGrid}>
              {metrics.map((metric) => (
                <View key={metric.label} style={styles.metricCard}>
                  <View style={[styles.metricAccent, { backgroundColor: metric.tone === 'green' ? '#3b806e' : metric.tone === 'blue' ? '#4775a6' : '#c18a45' }]} />
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={[styles.metricDetail, metric.tone === 'amber' && styles.amberText]}>{metric.detail}</Text>
                </View>
              ))}
            </View>

            <View style={styles.lowerGrid}>
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <View><Text style={styles.panelKicker}>RENDIMIENTO</Text><Text style={styles.panelTitle}>Ventas por semana</Text></View>
                  <Text style={styles.panelAction}>Este mes ▾</Text>
                </View>
                <View style={styles.chart}>
                  {[42, 60, 48, 73, 66, 88, 78].map((height, index) => (
                    <View key={index} style={styles.chartColumn}>
                      <View style={[styles.chartBar, { height: `${height}%` }]} />
                      <Text style={styles.chartLabel}>S{index + 1}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.panel}>
                <View style={styles.panelHeader}><View><Text style={styles.panelKicker}>ACTIVIDAD</Text><Text style={styles.panelTitle}>Ultimas acciones</Text></View><Text style={styles.panelAction}>Ver todo</Text></View>
                <ActivityRow label="Pedido #SO-1048 confirmado" detail="Hace 8 min" tone="green" />
                <ActivityRow label="Stock actualizado · Almacen Norte" detail="Hace 24 min" tone="blue" />
                <ActivityRow label="Nuevo usuario agregado" detail="Hace 1 h" tone="amber" />
              </View>
            </View>
          </ScrollView>
        </View>

        {drawer && <DrawerPanel type={drawer} onClose={() => setDrawer(null)} />}
        {commandOpen && (
          <View style={styles.overlay}>
            <Pressable style={styles.overlayDismiss} onPress={() => setCommandOpen(false)} />
            <View style={styles.commandPalette}>
              <TextInput autoFocus value={commandQuery} onChangeText={setCommandQuery} placeholder="Que quieres hacer?" placeholderTextColor="#8b938e" style={styles.commandInput} />
              {visibleCommands.map((command, index) => <Pressable key={command} style={styles.commandItem} onPress={() => setCommandOpen(false)}><Text style={styles.commandIndex}>{index + 1}</Text><Text style={styles.commandText}>{command}</Text><Text style={styles.commandArrow}>↵</Text></Pressable>)}
              <Text style={styles.commandHint}>ESC para cerrar · Navega con las flechas</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return <Pressable style={[styles.navItem, active && styles.navItemActive]}><View style={[styles.navBullet, active && styles.navBulletActive]} /><Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text></Pressable>;
}

function ActivityRow({ label, detail, tone }: { label: string; detail: string; tone: Metric['tone'] }) {
  return <View style={styles.activityRow}><View style={[styles.activityDot, { backgroundColor: tone === 'green' ? '#3b806e' : tone === 'blue' ? '#4775a6' : '#c18a45' }]} /><View><Text style={styles.activityLabel}>{label}</Text><Text style={styles.activityDetail}>{detail}</Text></View></View>;
}

function DrawerPanel({ type, onClose }: { type: Exclude<Drawer, null>; onClose: () => void }) {
  const isNotifications = type === 'notifications';
  return <View style={styles.drawer}><View style={styles.drawerHeader}><Text style={styles.drawerTitle}>{isNotifications ? 'Notificaciones' : 'Espacio de trabajo'}</Text><Pressable onPress={onClose}><Text style={styles.closeButton}>×</Text></Pressable></View><Text style={styles.drawerCopy}>{isNotifications ? 'Tienes 3 actualizaciones pendientes.' : 'Acme Retail · Produccion'}</Text>{isNotifications ? <ActivityRow label="Stock critico detectado" detail="17 SKUs necesitan revision" tone="amber" /> : <ActivityRow label="Produccion" detail="Region global · 24 usuarios" tone="green" />}</View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef0ed' },
  shell: { flex: 1, flexDirection: 'row', minHeight: '100vh' },
  sidebar: { width: 238, backgroundColor: '#173b3a', padding: 24, justifyContent: 'flex-start' },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 58 },
  brandMark: { width: 30, height: 30, borderRadius: 7, backgroundColor: '#e3b978', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  brandMarkText: { color: '#173b3a', fontWeight: '800', fontSize: 17 },
  brandName: { color: '#f4f1e9', fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  eyebrow: { color: '#8ca4a0', fontSize: 10, letterSpacing: 1.6, fontWeight: '700', marginBottom: 14 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 6, marginBottom: 4 },
  navItemActive: { backgroundColor: '#2a5550' },
  navBullet: { width: 7, height: 7, borderRadius: 7, backgroundColor: '#6f8c87', marginRight: 12 },
  navBulletActive: { backgroundColor: '#e3b978' },
  navLabel: { color: '#aec1bb', fontSize: 14 },
  navLabelActive: { color: '#ffffff', fontWeight: '700' },
  sidebarBottom: { marginTop: 'auto' },
  workspaceButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  workspaceDot: { width: 10, height: 10, borderRadius: 10, backgroundColor: '#76b99f', marginRight: 10 },
  workspaceCopy: { flex: 1 },
  workspaceName: { color: '#f4f1e9', fontSize: 12, fontWeight: '700' },
  workspaceMeta: { color: '#8ca4a0', fontSize: 11, marginTop: 3 },
  chevron: { color: '#8ca4a0', fontSize: 20 },
  content: { flex: 1 },
  topbar: { minHeight: 84, borderBottomWidth: 1, borderBottomColor: '#dfe3df', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 38 },
  breadcrumb: { color: '#78837d', fontSize: 10, letterSpacing: 1.3, fontWeight: '700', marginBottom: 6 },
  pageTitle: { color: '#1c2d2c', fontSize: 19, fontWeight: '700' },
  topbarActions: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  commandTrigger: { borderWidth: 1, borderColor: '#d2d9d4', backgroundColor: '#f8f9f7', borderRadius: 5, height: 36, width: 218, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11 },
  searchIcon: { color: '#51645f', fontSize: 21, marginRight: 7 },
  commandTriggerText: { color: '#76817c', flex: 1, fontSize: 12 },
  shortcut: { color: '#9da7a2', fontSize: 10 },
  iconButton: { position: 'relative', padding: 6 },
  iconText: { color: '#46615c', fontSize: 22 },
  notificationDot: { position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: 6, backgroundColor: '#c36d51' },
  avatar: { width: 34, height: 34, borderRadius: 34, backgroundColor: '#d8b98b', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#5c4128', fontSize: 11, fontWeight: '800' },
  dashboard: { padding: 38, maxWidth: 1300, width: '100%', alignSelf: 'center' },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 },
  sectionKicker: { color: '#78837d', fontSize: 10, letterSpacing: 1.4, fontWeight: '700', marginBottom: 11 },
  heroTitle: { color: '#1c2d2c', fontSize: 34, fontWeight: '800', letterSpacing: 0 },
  heroCopy: { color: '#687671', fontSize: 14, marginTop: 7 },
  primaryButton: { backgroundColor: '#c97655', borderRadius: 5, paddingHorizontal: 18, paddingVertical: 12 },
  primaryButtonText: { color: '#fffaf4', fontSize: 13, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  metricCard: { flex: 1, backgroundColor: '#fafbf9', borderWidth: 1, borderColor: '#e1e5e1', borderRadius: 6, padding: 20, minHeight: 142, overflow: 'hidden' },
  metricAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  metricLabel: { color: '#71807a', fontSize: 12, marginBottom: 13 },
  metricValue: { color: '#1c2d2c', fontSize: 26, fontWeight: '800' },
  metricDetail: { color: '#3f8670', fontSize: 11, marginTop: 10 },
  amberText: { color: '#b87738' },
  lowerGrid: { flexDirection: 'row', gap: 20 },
  panel: { flex: 1, backgroundColor: '#fafbf9', borderWidth: 1, borderColor: '#e1e5e1', borderRadius: 6, padding: 22, minHeight: 280 },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  panelKicker: { color: '#87918c', fontSize: 10, letterSpacing: 1.2, fontWeight: '700', marginBottom: 6 },
  panelTitle: { color: '#203331', fontSize: 16, fontWeight: '700' },
  panelAction: { color: '#bb7654', fontSize: 11, fontWeight: '700' },
  chart: { height: 176, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: 28 },
  chartColumn: { height: '100%', alignItems: 'center', justifyContent: 'flex-end', width: 28 },
  chartBar: { backgroundColor: '#79a99a', width: 18, borderRadius: 3 },
  chartLabel: { color: '#8c9791', fontSize: 10, marginTop: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#edf0ed' },
  activityDot: { width: 8, height: 8, borderRadius: 8, marginRight: 12 },
  activityLabel: { color: '#354744', fontSize: 12, fontWeight: '600' },
  activityDetail: { color: '#8b9690', fontSize: 11, marginTop: 4 },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', paddingTop: 105, zIndex: 10 },
  overlayDismiss: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20, 43, 41, 0.28)' },
  commandPalette: { width: 480, backgroundColor: '#fbfcfa', borderRadius: 8, padding: 10, shadowColor: '#122b29', shadowOpacity: 0.25, shadowRadius: 20, elevation: 8 },
  commandInput: { height: 45, borderBottomWidth: 1, borderBottomColor: '#e2e7e2', paddingHorizontal: 12, color: '#243a37', fontSize: 15, outlineStyle: 'none' } as any,
  commandItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 5 },
  commandIndex: { color: '#b97758', width: 25, fontSize: 11, fontWeight: '700' },
  commandText: { color: '#304440', flex: 1, fontSize: 13 },
  commandArrow: { color: '#9aa49e', fontSize: 15 },
  commandHint: { color: '#9aa49e', fontSize: 10, padding: 10 },
  drawer: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 330, backgroundColor: '#fbfcfa', padding: 26, shadowColor: '#122b29', shadowOpacity: 0.18, shadowRadius: 18, elevation: 8, zIndex: 8 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  drawerTitle: { color: '#203331', fontSize: 19, fontWeight: '800' },
  closeButton: { color: '#71807a', fontSize: 27, fontWeight: '300' },
  drawerCopy: { color: '#687671', fontSize: 13, marginBottom: 14 },
});
