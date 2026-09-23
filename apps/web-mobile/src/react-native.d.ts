declare module 'react-native' {
  export const Pressable: any;
  export const SafeAreaView: any;
  export const ScrollView: any;
  export const StyleSheet: {
    create<T extends Record<string, unknown>>(styles: T): T;
    absoluteFillObject: Record<string, unknown>;
  };
  export const Text: any;
  export const TextInput: any;
  export const View: any;
}
