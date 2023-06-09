#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import "RNVoipCall.h"                          /* <------ add this line */
#import <PushKit/PushKit.h>                    /* <------ add this line */
#import "RNVoipPushKit.h"                      /* <------ add this line */
//  #ifdef FB_SONARKIT_ENABLED
//  #import <FlipperKit/FlipperClient.h>
//  #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
//  #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
//  #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
//  #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
//  #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

//  static void InitializeFlipper(UIApplication *application) {
//    FlipperClient *client = [FlipperClient sharedClient];
//    SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
//    [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
//    [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
//    [client addPlugin:[FlipperKitReactPlugin new]];
//    [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
//    [client start];
//  }
//  #endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Tabibi"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  return YES;
}
// --- Handle updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  [RNVoipPushKit didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type
{
  // --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type. Instead, use this method to notify your server not to send push notifications using the matching push token.
}

// --- Handle incoming pushes (for ios <= 10)
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type {
   NSLog(@"Ajith");
  
  
  
  [RNVoipPushKit didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
}

// --- Handle incoming pushes (for ios >= 11)
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  
    NSString *callerName = @"Calling";
  NSString *callerId = [[[NSUUID UUID] UUIDString] lowercaseString];
  NSString *handle = @"1234567890";
  NSString *handleType = @"generic";
  BOOL hasVideo = true;
  
  
 NSLog(@"dataPayload ===> %@",payload.dictionaryPayload);
  @try {
    if([payload.dictionaryPayload[@"data"] isKindOfClass:[NSDictionary class]]){
      NSDictionary *dataPayload = payload.dictionaryPayload[@"data"];

      callerName = [dataPayload[@"name"] isKindOfClass:[NSString class]] ?  [NSString stringWithFormat: @"%@ is Calling", dataPayload[@"name"]] : @"Calling";
      
      callerId = [dataPayload[@"uuid"] isKindOfClass:[NSString class]] ?  dataPayload[@"uuid"] : dataPayload[@"uuid"];
      
      handle = [dataPayload[@"handle"] isKindOfClass:[NSString class]] ?  dataPayload[@"handle"] : @"0000";
      
      handleType = [dataPayload[@"handleType"] isKindOfClass:[NSString class]] ?  dataPayload[@"handleType"] : @"generic";
      
      hasVideo = dataPayload[@"hasVideo"] ? true : false;
      
    }
  } @catch (NSException *exception) {
    
    NSLog(@"Error PushKit payload %@", exception);
    
  } @finally {
    
    
   NSLog(@"caller id ===> %@    callerNAme  ==> %@ handle  ==> %@",callerId, callerName, hasVideo ? @"true": @"false");
    
    NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"data"];
    
    [RNVoipCall reportNewIncomingCall:callerId handle:handle handleType:handleType hasVideo:hasVideo localizedCallerName:callerName fromPushKit: YES payload:extra withCompletionHandler:completion];
    
    [RNVoipPushKit didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
    
  }
}
- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"FCM registration token: %@", fcmToken);
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:
     @"FCMToken" object:nil userInfo:dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
  
  NSLog(@"FCM Token: %@",fcmToken);
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [FIRMessaging messaging].APNSToken = deviceToken;
  NSString * deviceTokenString = [[[[deviceToken description]
                           stringByReplacingOccurrencesOfString: @"<" withString: @""]
                          stringByReplacingOccurrencesOfString: @">" withString: @""]
                         stringByReplacingOccurrencesOfString: @" " withString: @""];

  NSLog(@"The generated device token string is : %@",deviceTokenString);
}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
