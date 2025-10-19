// app/components/ConflictResolver.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default function ConflictResolver({ visible, conflicts, onResolve, onCancel }:
  { visible: boolean; conflicts: any[]; onResolve: (resolved:any[]) => void; onCancel: ()=>void }) {

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Conflict resolver</Text>
          <Text style={styles.subtitle}>Kies of merge lokale of server wijzigingen</Text>

          <FlatList
            data={conflicts || []}
            keyExtractor={(i, idx) => String(idx)}
            renderItem={({item, index}) => (
              <View style={styles.row}>
                <Text style={styles.rowTitle}>{item.id}</Text>
                <Text style={styles.rowText}>Local: {JSON.stringify(item.local)}</Text>
                <Text style={styles.rowText}>Server: {JSON.stringify(item.server)}</Text>
              </View>
            )}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel}><Text style={styles.cancel}>Annuleren</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>onResolve(conflicts)}><Text style={styles.resolve}>Automerge</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', alignItems:'center' },
  container: { width:'92%', maxHeight:'80%', backgroundColor:'#fff', borderRadius:12, padding:16 },
  title: { fontWeight:'800', fontSize:18 },
  subtitle: { color:'#666', marginBottom:12 },
  row: { paddingVertical:8, borderBottomWidth:1, borderColor:'#eee' },
  rowTitle: { fontWeight:'700' },
  rowText: { color:'#333', fontSize:12 },
  actions: { flexDirection:'row', justifyContent:'space-between', marginTop:12 },
  cancel: { color:'#666' },
  resolve: { color:'#0b84ff', fontWeight:'700' }
});
